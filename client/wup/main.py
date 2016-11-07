#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys, os, time
import traceback, subprocess
import argparse, json, httplib, urllib,hashlib, thread

# begin 全局变量
# APPS = {}
WATCHDOG_CHECK = True
ROOT = "/opt"
CONFS = dict(
    host = "192.168.88.133",
    apiroot = "/api/root/wup/v1",
    approot = "/opt",
    godkey = "123456"
)
# End 全局变量


# begin 主函数群
def main():
    # begin 处理命令行参数
    global ROOT
    global WATCHDOG_CHECK
    if len(sys.argv) > 1 :
        ROOT = sys.argv[1]
    reloadConfig()
    debug("CONFIG=" + json.dumps(CONFS, indent=2))
    # end 处理命令行参数

    thread.start_new_thread(watchdog, ())

    # begin 事件循环
    while 1 :
        try:
            loop()
        except Exception as e:
            traceback.print_exc()
        WATCHDOG_CHECK = True
        time.sleep(15)
    # end 事件循环

def loop():

    if not CONFS.get("key") :
        re = getJson("/node/init", {"macid":CONFS["macid"], "godkey" : CONFS["godkey"]})
        if re and re.get("key") :
            CONFS.update(re)
            writeConfig()
    remotec = getJson("/node/get", {"macid":CONFS["macid"], "key":CONFS["key"]})
    writeJsonFile(ROOT + "/wup_remote.json", remotec)
    localc = readJsonFile(ROOT + "/wup_local.json")
    if not localc.get("pkgs") :
        localc["pkgs"] = {}

    debug("remotec="+json.dumps(remotec))
    # 检查各pkg的版本
    for pkg in remotec["pkgs"] :
        pkg_name = pkg["name"]
        pkg_version = pkg.get("version") or "lastest"
        check_resp = getJson("/pkg/info", {"macid":CONFS["macid"], "key":CONFS["key"], "name":pkg_name, "version":pkg_version})
        if not check_resp :
            warn("no such pkg=%s version=%s ?" % (pkg_name, pkg_version))
            continue
        if localc["pkgs"].get(pkg_name) and check_resp.get("sha1") == localc["pkgs"][pkg_name].get("sha1") :
            continue
        WATCHDOG_CHECK = False
        dst = ROOT + "/wup/pkgs/"+pkg_name + "/" + pkg_version +".tgz"
        downloadFile("/pkg/get", {"macid":CONFS["macid"], "key":CONFS["key"], "name":pkg_name, "version":pkg_version}, dst, check_resp.get("sha1"))
        _install(dst)
        localc["pkgs"][pkg_name] = check_resp
        writeJsonFile(ROOT + "/wup_local.json", localc)

def watchdog() :
    while 1 :
        _watchdog()
        time.sleep(3)

def reloadConfig():
    tmp = readJsonFile(ROOT + "/wup_config.json")
    CONFS.update(tmp)
    CONFS["macid"] = _macid()

def writeConfig() :
    writeJsonFile(ROOT + "/wup_config.json", CONFS)

def _install(dst) :
    debug("install ... " + dst )
    subprocess.check_call("tar -C /tmp -x -f " + dst, shell=1)
    subprocess.check_call("WUPROOT=%s /tmp/update" % (ROOT), cwd="/tmp", shell=1)
    debug("install complete " + dst)

# end 主函数群

# begin 帮助函数
def getJson(uri, params):
    hc = None
    try:
        hc = _http()
        hc.request('GET', CONFS["apiroot"] + uri + "?" + urllib.urlencode(params))
        resp = hc.getresponse()
        if resp.status == 200 :
            data = resp.read()
            if data and data[0] == "{":
                return json.loads(data)
    except Exception, e:
        traceback.print_exc()
    finally :
        if hc :
            hc.close()

def downloadFile(uri, params, dst, sha1) :
    if _sha1(dst) == sha1 :
        debug("same sha1 >> " + dst)
        return
    else :
        debug("expect %s but %s" % (sha1, _sha1(dst)))
    hc = None
    try:
        debug("download file >> " + dst)
        hc = _http()
        hc.request('GET', CONFS["apiroot"] + uri + "?" + urllib.urlencode(params))
        resp = hc.getresponse()
        if resp.status == 200 :
            if os.path.exists(dst) :
                os.remove(dst)
            elif not os.path.exists(os.path.dirname(dst)):
                os.makedirs(os.path.dirname(dst))
            with open(dst, "w") as f :
                while 1:
                    buf = resp.read(8192*1024)
                    if not buf :
                        break
                    f.write(buf)
            debug("Download Complete >> " + dst)
            return
        debug("WHAT?!!! code=" + resp.status)
    except Exception, e:
        traceback.print_exc()
    finally :
        if hc :
            hc.close()


def _http() :
    hc = httplib.HTTPConnection(CONFS["host"], 8080, timeout=30)
    hc.__exit__ = hc.close
    return hc

def getHwAddr(ifname):
    if sys.platform == 'win32' :
        return "AABBCCDDEEFF"
    import fcntl, socket, struct
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    info = fcntl.ioctl(s.fileno(), 0x8927,  struct.pack('256s', ifname[:15]))
    return ''.join(['%02x' % ord(char) for char in info[18:24]])

def _macid() :
    try:
        return getHwAddr("eth0")
    except Exception as e:
        return getHwAddr("enp0s3")

def readJsonFile(path) :
    if os.path.exists(path) :
        with open(path) as f :
            return json.loads(f.read())
    return {}

def writeJsonFile(path, vals) :
    with open(path, "w") as f :
        json.dump(vals, f)

def debug(msg):
    print "DEBUG", msg

def info(msg):
    print "INFO ", msg

def warn(msg):
    print "WARN ", msg

def error(msg):
    print "ERROR", msg

def _sha1(path) :
    if not os.path.exists(path) :
        debug("not exists " + path)
        return

    m = hashlib.sha1()
    with open(path, "rb") as f:
        while True:
            data = f.read(8192)
            if not data:
                break
            m.update(data)
    return m.hexdigest()

# end 帮助函数

# begin 日志

import time
import os,os.path
import sys
import logging, logging.handlers
import subprocess
import threading
from compiler.ast import Exec

log = logging.getLogger()
log.setLevel(logging.DEBUG)
fh = logging.handlers.RotatingFileHandler("/dev/shm/watchdog.log", maxBytes=16*1024*1024,
                                          backupCount=1, encoding="UTF-8")
fh.setLevel(logging.DEBUG)
formatter = logging.Formatter('$: %(asctime)s > %(levelname)-5s > %(filename)s:%(lineno)s > %(message)s')
fh.setFormatter(formatter)
log.addHandler(fh)

td = {}

base = ROOT

def _watchdog():
    global base
    base = ROOT
    if not WATCHDOG_CHECK :
        return
    try:
        for app in os.listdir(base) :
            if app in td.keys() and td[app].isAlive() :
                continue
            if "-" in app :
                continue
            start_cmd = "%s/%s/start.sh" % (base, app)
            stop_cmd  = "%s/%s/stop.sh"  % (base, app)
            if os.path.exists(start_cmd) and os.path.exists(stop_cmd) :
                log.info("add new app " + app)
                t = ExecThread(os.path.dirname(start_cmd), app,  start_cmd, stop_cmd)
                td[app] = t
                t.start()
        #subprocess.call(["uptime"])
        time.sleep(1)
    except:
        log.info("bad bad", exc_info=True)

class ExecThread(threading.Thread):

    def __init__(self, app_root, app, start_cmd, stop_cmd):
        threading.Thread.__init__(self)
        self.app_root  = app_root
        self.start_cmd = start_cmd
        self.stop_cmd  = stop_cmd
        self.app = app
        self.daemon    = True

    def run(self):
        log.info("restart app --> " + self.app)
        subprocess.call(["chmod", "777", self.stop_cmd])
        subprocess.call(["chmod", "777", self.start_cmd])
        subprocess.call(self.stop_cmd, cwd=self.app_root, close_fds=True, shell=1)
        time.sleep(5)
        subprocess.call(self.start_cmd, cwd=self.app_root, close_fds=True, shell=1)

# end 日志

if __name__ == '__main__':
    main()

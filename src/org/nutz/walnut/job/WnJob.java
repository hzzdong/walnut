package org.nutz.walnut.job;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.lang.Lang;
import org.nutz.lang.Strings;
import org.nutz.lang.random.R;
import org.nutz.lang.util.NutMap;
import org.nutz.quartz.Quartz;
import org.nutz.quartz.QzEach;
import org.nutz.walnut.api.box.WnBoxContext;
import org.nutz.walnut.api.hook.WnHookContext;
import org.nutz.walnut.api.hook.WnHookService;
import org.nutz.walnut.api.io.WnObj;
import org.nutz.walnut.api.io.WnQuery;
import org.nutz.walnut.api.io.WnRace;
import org.nutz.walnut.api.usr.WnSession;
import org.nutz.walnut.api.usr.WnUsr;
import org.nutz.walnut.util.Wn;
import org.nutz.walnut.util.WnRun;

@IocBean(create = "init", depose = "depose")
public class WnJob extends WnRun implements Callable<Object> {

    protected static ThreadPoolExecutor es = (ThreadPoolExecutor) Executors.newFixedThreadPool(64);
    public static String root = "/sys/job";
    protected String tmpRoot = "/sys/job/tmp";
    public static WnJob me;
    @Inject
    protected WnHookService hookService;

    public boolean isRunning() {
        return es != null && !es.isShutdown();
    }

    public void depose() {
        if (es != null)
            es.shutdown();
    }

    public String toString() {
        return es.toString();
    }

    public WnJob() {
        me = this;
    }

    public void init() {
        io.createIfNoExists(null, root, WnRace.DIR);
        io.createIfNoExists(null, tmpRoot, WnRace.DIR);
        es.submit(this);
    }

    public WnObj next() {
        Date now = new Date();
        String pid = io.check(null, root).id();
        WnQuery query = new WnQuery();
        query.setv("pid", pid);
        // query.limit(1);
        // query.sortBy("job_ava", 1);
        query.setv("job_ava", new NutMap().setv("$lt", now.getTime()));
        List<WnObj> list = io.query(query);
        if (list == null || list.isEmpty())
            return null;
        WnObj jobDir = list.get(0);
        String cron = jobDir.getString("job_cron");
        if (Strings.isBlank(cron)) {
            io.appendMeta(jobDir, "job_ava:" + (now.getTime() + 24 * 60 * 60 * 1000L));
            return jobDir;
        }
        final Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        if (calendar.get(Calendar.HOUR_OF_DAY) == 23 && calendar.get(Calendar.MINUTE) > 55) {
            calendar.set(Calendar.MINUTE, 56);
            calendar.add(Calendar.DAY_OF_YEAR, 1);
            io.appendMeta(jobDir, "job_ava:" + calendar.getTimeInMillis());
        } else {
            calendar.set(Calendar.MINUTE, 56);
            io.appendMeta(jobDir, "job_ava:" + calendar.getTimeInMillis());
        }
        // TODO 如果cron是非法的,就挂了
        Quartz quartz = Quartz.NEW(cron);
        if (!quartz.matchDate(calendar)) {
            return null;
        }
        int MIN_TNT = 3; // 3分钟间隔
        Integer[] jobs = new Integer[24 * 60 / MIN_TNT];
        quartz.each(jobs, new QzEach<Integer>() {
            public void invoke(Integer[] array, int index) throws Exception {
                calendar.set(Calendar.HOUR_OF_DAY, (index * MIN_TNT) / 60);
                calendar.set(Calendar.MINUTE, (index * MIN_TNT) % 60);
                WnObj _jobDir = io.create(null, tmpRoot + "/" + R.UU32(), WnRace.DIR);
                WnObj _jobCmd = io.create(_jobDir, "cmd", WnRace.FILE);
                // TODO 咋拷贝文件夹呢?
            }
        }, calendar);
        return jobDir;
    }

    public Object call() throws Exception {
        while (true) {
            WnObj next = this.next();
            if (next == null) {
                Lang.quiteSleep(1000);
                continue;
            }
            es.submit(new WalnutJobExecutor(next));
        }
    }

    public class WalnutJobExecutor implements Callable<Object> {

        protected WnObj jobDir;

        public WalnutJobExecutor(WnObj job) {
            this.jobDir = job;
        }

        public Object call() throws Exception {
            try {
                io.appendMeta(jobDir,
                              new NutMap().setv("job_start", System.currentTimeMillis())
                                          .setv("job_st", "run"));
                WnObj cmdFile = io.fetch(jobDir, "cmd");
                if (cmdFile != null) {
                    String cmdText = io.readText(cmdFile);
                    WnUsr usr = usrs.fetch(jobDir.getString("job_user"));
                    if (usr != null) {
                        WnSession se = sess.create(usr);
                        Wn.WC().me(usr.name(), jobDir.getString("job_group", usr.name()));
                        WnBoxContext bc = new WnBoxContext();
                        bc.io = io;
                        bc.me = usr;
                        bc.session = se;
                        bc.usrService = usrs;
                        bc.sessionService = sess;
                        WnHookContext hc = new WnHookContext(boxes, bc);
                        hc.io = io;
                        hc.me = usr;
                        hc.se = se;
                        hc.service = hookService;

                        Wn.WC().setHookContext(hc);
                        exec("job-" + jobDir.getString("job_name", "_") + " ", se, "", cmdText);
                    }
                }
            }
            finally {
                io.appendMeta(jobDir,
                              new NutMap().setv("job_end", System.currentTimeMillis())
                                          .setv("job_st", "done"));
            }
            return null;
        }

    }
}

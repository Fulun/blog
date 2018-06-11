#### You have thread T1, T2, and T3, how will you ensure that thread T2 run after T1 and thread T3 run after T2?  
可以通过线程的Join()方法实现，如下所示：
```Java
public class TheadJoinTest implements Runnable {

	@Override
	public void run() {
		Thread t = Thread.currentThread();
		System.out.println("RunnableJob is being run by " + t.getName()
				+ " at " + new Date());
		try {
			TimeUnit.SECONDS.sleep(1);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) throws InterruptedException {
		Runnable runnable = new TheadJoinTest();
		Thread t1 = new Thread(runnable);
		Thread t2 = new Thread(runnable);
		Thread t3 = new Thread(runnable);
		Thread t4 = new Thread(runnable);
		Thread t5 = new Thread(runnable);
		Thread t6 = new Thread(runnable);
		Thread t7 = new Thread(runnable);
		t1.start();
		t1.join();
		t2.start();
		t2.join();
		t3.start();
		t3.join();
		t4.start();
		t5.start();
		t6.start();
		t7.start();
	}
}/*
RunnableJob is being run by Thread-0 at Sun Jun 10 21:57:24 CST 2018
RunnableJob is being run by Thread-1 at Sun Jun 10 21:57:25 CST 2018
RunnableJob is being run by Thread-2 at Sun Jun 10 21:57:26 CST 2018
RunnableJob is being run by Thread-3 at Sun Jun 10 21:57:27 CST 2018
RunnableJob is being run by Thread-6 at Sun Jun 10 21:57:27 CST 2018
RunnableJob is being run by Thread-4 at Sun Jun 10 21:57:27 CST 2018
RunnableJob is being run by Thread-5 at Sun Jun 10 21:57:27 CST 2018
*///~
```
t1、t2、t3每个线程调用start()方法之后紧接着调用join()方法。以t1.join()为例，join方法将会阻塞当前线程的（main线程）的继续执行，直到t1线程执行完成, 才会接着执行t2.start()。t4、t5、t6、t7线程没有调用join()方法，所以不会阻塞main主线程。从输出结果的时间戳上也可以看出，t1, t2, t3线程每间隔一秒钟顺序输出，而t4, t5, t6, t7线程同时发生，且顺序没有保证，thread-6就在thread-4之前。  
Note that join() can also take times in milliseconds and nanoseconds as parameters. These values specify the maximum amount of time to wait before returning the blocked thread's state to RUNNABLE.  
join的重载方法支持时间参数（微秒和纳秒），这些值指定了阻塞线程恢复到runable状态的最大等待时间。  
- **Ref**  
[what does this thread join code mean?](https://stackoverflow.com/questions/15956231/what-does-this-thread-join-code-mean?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa  )  
[how do i user threads join method?](https://www.avajava.com/tutorials/lessons/how-do-i-use-threads-join-method.html)
***
#### 线程有那几种状态？
线程总共有六中状态：NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED
- **new**  
The thread is in new state if you create an instance of Thread class but before the invocation of start() method.  
new了一个线程，还没有调用它的start()方法。
- **Runnable**  
The thread is in runnable state after invocation of start() method, but the thread scheduler has not selected it to be the running thread.  
调用了start()方法，线程就会处在Runnable状态。但是此时thread scheduler还没有选择该线程，所以不在Running状态。  
- **Running**  
The thread is in running state if the thread scheduler has selected it.  
thread scheduler选择了处在Ready状态的线程，该线程进入Running状态。  
- **Timed waiting** 
Timed waiting is a thread state for a thread waiting with a specified waiting time. A thread is in the timed waiting state due to calling one of the following methods with a specified positive waiting time:   
通过调用如下方法让线程处于`Timed waiting`状态。   
	- Thread.sleep(sleeptime)  //静态方法
    - Object.wait(timeout)     //对象的wait方法
    - Thread.join(timeout)     //例如线程t的join方法
    - LockSupport.parkNanos(timeout)  
    - LockSupport.parkUntil(timeout)  
- **Waiting**  
A thread is in the waiting state due to the calling one of the following methods without timeout:  
可以通过调用如下方法让线程处于`waiting`状态。注意没有超时参数  
    - Object.wait()  
    - Thread.join()  
    - LockSupport.park()  
 Note, that thread in the waiting state is waiting for another thread to perform a particular action. For example, a thread that has called Object.wait() on an object is waiting for another thread to call Object.notify() or Object.notifyAll() on that object. A thread that has called Thread.join() is waiting for a specified thread to terminate. It means that waiting state could be made a composite state with states corresponding to these specific conditions.  
 线程处于waiting状态，则正在等待其他线程执行某个特殊操作。比如说，一个线程调用了某个对象的Object.wait()方法，那么他就正在等待其他线程调用这个对象的Object.notify()方法或者 Object.notifyAll()方法。
- **Blocked**  
Thread is in the blocked state while waiting for the monitor lock to enter a synchronized block or method or to reenter a synchronized block or method after calling Object.wait().  
等待获取monitor锁进入同步块、方法时，线程就处于blocked状态。或者调用wait方法后等待重新进入同步块或方法。调用wait方法会释放锁。
wait和notify方法必须放在同步块中。
- **terminated**  
After thread has completed execution of run() method, it is moved into terminated state.



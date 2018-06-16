#### ReentrantReadWriteLock
该类实现自`ReadWriteLock`接口。Basically, a ReadWriteLock is designed as a high-level locking mechanism that allows you to add thread-safety feature to a data structure while increasing throughput by allowing multiple threads to read the data concurrently and one thread to update the data exclusively.  
允许你为数据结构增加线程安全的特性。允许多个线程并发读，从而增加了并发访问的吞吐量，允许一个线程写。  
- 创建`ReentrantReadWriteLock`锁  
```Java
ReadWriteLock rwLock = new ReentrantReadWriteLock();
```
The `ReentrantReadWriteLock` maintains two separate locks, one for reading and one for writing:  
`ReentrantReadWriteLock`包含两个独立的锁，分别用于读和写：  
```Java
Lock writeLock = rwLock.writeLock();
Lock readLock = rwLock.readLock();
```
Then you can use the read lock to safeguard a code block that performs read operation like this:  
使用读锁： 
```Java
Lock readLock = rwLock.readLock();
readLock.lock();
try {
    //reading data
}
finally {
    readLock.unlock();
}
```
And use the write lock to safeguard a code block that performs update operation like this:  
使用写锁： 
```Java
Lock writeLock = rwLock.writeLock();
writeLock.lock();
try {
    //udpate data
}
finally {
    writeLock.unlock();
}
```
A ReadWriteLock implementation guarantees the following behaviors:  
- Multiple threads can read the data at the same time, as long as there’s no thread is updating the data.  
多个线程可以同时读，只要没有线程正在更新数据。  
- Only one thread can update the data at a time, causing other threads (both readers and writers) block until the write lock is released.  每次只能有一个线程可以更新数据。此时其他读写线程阻塞，直至写锁释放。  
- If a thread attempts to update the data while other threads are reading, the write thread also blocks until the read lock is released.  如果一个线程尝试更新数据，而其他线程正在读，那么写线程将会阻塞直至读锁释放。
```Java
public class RWDictionary {
    private final Map<String, Data> m = new TreeMap<String, Data>();
    private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
    private final Lock r = rwl.readLock();
    private final Lock w = rwl.writeLock();

    public Data get(String key) {
        r.lock();
        try {
            return m.get(key);
        } finally {
            r.unlock();
        }
    }

    public String[] allKeys() {
        r.lock();
        try {
            return m.keySet().toArray(new String[0]);
        } finally {
            r.unlock();
        }
    }

    public Data put(String key, Data value) {
        w.lock();
        try {
            return m.put(key, value);
        } finally {
            w.unlock();
        }
    }

    public void clear() {
        w.lock();
        try {
            m.clear();
        } finally {
            w.unlock();
        }
    }
}
```
To implement Singleton pattern, we have different approaches but all of them have following common concepts. [Ref](https://www.journaldev.com/1377/java-singleton-design-pattern-best-practices-examples#eager-initialization)  
- Private constructor to restrict instantiation of the class from other classes. 私有构造函数  
- Private static variable of the same class that is the only instance of the class.相同类型的私有静态属性。  
- Public static method that returns the instance of the class, this is the global access point for outer world to get the instance of the singleton class. 提供一个对外的公共静态方法，返回这个静态的私有属性。

1. **Eager initialization** 饿汉模式  
In eager initialization, **the instance of Singleton Class is created at the time of class loading**, this is the easiest method to create a singleton class but **it has a drawback that instance is created even though client application might not be using it**.
```Java
public class Eagerinitialization {
    private static final Eagerinitialization instance = new Eagerinitialization();
    //private constructor to avoid client applications to use constructor
    private Eagerinitialization() {}

    public static Eagerinitialization getInstance() {
        return instance;
    }
}
```
If your singleton class is not using a lot of resources, this is the approach to use. But in most of the scenarios, Singleton classes are created for resources such as File System, Database connections etc and **we should avoid the instantiation until unless client calls the getInstance method. Also this method doesn’t provide any options for exception handling**. 缺点：这种单例构造未提供异常处理功能。  
2. **Static block initialization**  
Static block initialization implementation is similar to eager initialization, except that instance of class is created in the static block that provides option for exception handling. 相比与第一种，提供了异常处理机制。
```Java
public class StaticBlockSingleton {
    private static StaticBlockSingleton instance;
    private StaticBlockSingleton() {}

    static {
        try {
            instance = new StaticBlockSingleton();
        } catch (Exception e) {
            throw new RuntimeException(
                    "Exception occured in creating singleton instance");
        }

    }
    public static StaticBlockSingleton getInstance() {
        return instance;
    }
}
```
Both eager initialization and static block initialization creates the instance even before it’s being used and that is not the best practice to use. 第一种和第二种相似。两个都在未使用实例前，就创建了实例，非最佳选择方案。  
3. **Lazy Initialization** 懒汉模式  
```Java
public class LazyInitializedSingleton {
    private static LazyInitializedSingleton instance = null;
    private LazyInitializedSingleton() {}
    
    public static LazyInitializedSingleton getInstance() {
        if (instance == null) {
            instance = new LazyInitializedSingleton();
        }
        return instance;
    }
    
    public static void main(String[] args) {
        LazyInitializedSingleton.getInstance();
        LazyInitializedSingleton.getInstance();
    }
}
```
静态属性只会初始化一次，例如main方法中有两次getInstance，实际instance==null这一行断点只会进去一次。  
The above implementation works fine incase of single threaded environment but when it comes to multithreaded systems, it can cause issues if multiple threads are inside the if loop at the same time. It will destroy the singleton pattern and both threads will get the different instances of singleton class. In next section, we will see different ways to create a thread-safe singleton class. 单线程工作OK，多线程场景下不OK  
4. **Thread Safe Singleton** 线程安全的单例  
```Java
public class ThreadSafeSingleton {
    private static ThreadSafeSingleton instance;
    private ThreadSafeSingleton() {}
    public synchronized static ThreadSafeSingleton getInstance() {
        if (instance == null) {
            instance = new ThreadSafeSingleton();
        }
        return instance;
    }
}
```
上边这个方法实现单例，虽然线程安全，但是耗性能。  
Above implementation works fine and provides thread-safety but it reduces the performance because of cost associated with the synchronized method, although we need it only for the first few threads who might create the separate instances (Read: Java Synchronization). To avoid this extra overhead every time, **double checked locking principle** is used. In this approach, the synchronized block is used inside the condition with an additional check to ensure that only one instance of singleton class is created. 
```Java
public class ThreadSafeSingletonWithDoubleLocking { 
    private static volatile ThreadSafeSingletonWithDoubleLocking instance;

    private ThreadSafeSingletonWithDoubleLocking() {}

    public static ThreadSafeSingletonWithDoubleLocking getInstance() {
        if (instance == null) {
            synchronized (ThreadSafeSingletonWithDoubleLocking.class) {
                if (instance == null) {
                    instance = new ThreadSafeSingletonWithDoubleLocking();
                }
            }
        }
        return instance;
    }
}
```
为了防止指令重排，我们需要给instance加上volatile属性。  
5. **Bill Pugh Singleton Implementation** 线程安全，不需要同步，最好的方法  
Prior to Java 5, java memory model had a lot of issues and above approaches used to fail in certain scenarios where too many threads try to get the instance of the Singleton class simultaneously. So Bill Pugh came up with a different approach to create the Singleton class using a **inner static helper class**. The Bill Pugh Singleton implementation goes like this:  
```Java
public class BillPughSingleton {

    private BillPughSingleton(){}
    
    private static class SingletonHelper{
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }
    
    public static BillPughSingleton getInstance(){
        return SingletonHelper.INSTANCE;
    }
}
```
注意加final。 Notice the **private inner static class** that contains the instance of the singleton class. When the singleton class is loaded, SingletonHelper class is not loaded into memory and **only when someone calls the getInstance method, this class gets loaded and creates the Singleton class instance**.  
This is the most widely used approach for Singleton class **as it doesn’t require synchronization**. I am using this approach in many of my projects and it’s easy to understand and implement also. 
6. **Using Reflection to destroy Singleton Pattern**  
Reflection can be used to destroy all the above singleton implementation approaches. Let’s see this with an example class.上述的所有单例都可以通过反射的形式破坏。 
```Java
public class ReflectionSingletonTest {

    public static void main(String[] args) {
        EagerInitializedSingleton instanceOne = EagerInitializedSingleton.getInstance();
        EagerInitializedSingleton instanceTwo = null;
        try {
            Constructor[] constructors = EagerInitializedSingleton.class.getDeclaredConstructors();
            for (Constructor constructor : constructors) {
                //Below code will destroy the singleton pattern
                constructor.setAccessible(true);
                instanceTwo = (EagerInitializedSingleton) constructor.newInstance();
                break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(instanceOne.hashCode());
        System.out.println(instanceTwo.hashCode());
    }

}
```
getDeclaredConstructors这个方法可以获取私有构造方法。
When you run the above test class, you will notice that hashCode of both the instances are not same that destroys the singleton pattern.显然两者的hashcode不相等，单例被破坏。  
7. **Enum Singleton**  
To overcome this situation with Reflection, Joshua Bloch suggests the use of Enum to implement Singleton design pattern **as Java ensures that any enum value is instantiated only once in a Java program.** Since Java Enum values are globally accessible, so is the singleton. The drawback is that the enum type is somewhat inflexible; for example, it does not allow lazy initialization. 枚举单例，Java可以确保在Java程序中，任何枚举值只会被实例化一次。缺点是不够灵活，不允许懒汉初始化，其单例对象是在枚举类被加载的时候进行初始化的。 
```Java
public enum EnumSingleton {
    INSTANCE;
    
    public static void doSomething() {
        //do somethings
    }
}
``` 
JVM会阻止反射获取枚举类的私有构造方法。反射报错：  
```Java
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public enum EnumSingleton {
    INSTANCE;
    
    public static void main(String[] args) {
        try {
            Constructor<EnumSingleton> con = EnumSingleton.class
                    .getDeclaredConstructor();
            con.setAccessible(true);
            EnumSingleton singleton = con.newInstance();
        } catch (NoSuchMethodException | SecurityException
                | InstantiationException | IllegalAccessException
                | IllegalArgumentException | InvocationTargetException e) {
            e.printStackTrace();
        }
    }
}/*
java.lang.NoSuchMethodException: Singleon.EnumSingleton.<init>()
    at java.lang.Class.getConstructor0(Unknown Source)
    at java.lang.Class.getDeclaredConstructor(Unknown Source)
    at Singleon.EnumSingleton.main(EnumSingleton.java:16)
*///~
```
| 单例         | 线程安全      |是否防止反射构建  |是否懒加载 |
| -------------|:-------------:|:----------------:|:---------:|
| 双重锁检测   | yes           | No               |Yes        | 
| 静态内部类   | yes           | No               |yes        | 
| 枚举         | yes           | Yes              |No         |  


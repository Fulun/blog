#### loading linking and initializing
- loading\
Loading is the process of finding the binary representation of a class or interface type with a particular name and creating a class or interface from that binary representation.\
加载：加载是一个过程。通过找到某个类或接口的二进制表示，然后根据二进制表示创建类或接口的过程。
- Linking \
linking is the process of taking a class or interface and combining it into the run-time state of the Java Virtual Machine so that it can be executed.\
链接：链接也是一个过程。把接口或者类结合到jvm的的运行状态，从而可以执行。
-  Initialization\
Initialization of a class or interface consists of executing the class or interface initialization method `<clinit>`.
- Java Virtual Machine Startup\
The Java Virtual Machine starts up by creating an initial class, which is specified in an implementation-dependent manner, using the bootstrap class loader. The Java Virtual Machine then links the initial class, initializes it, and invokes the public class method `void main(String[])`. The invocation of this method drives all further execution. Execution of the Java Virtual Machine instructions constituting the `main` method may cause linking (and consequently creation) of additional classes and interfaces, as well as invocation of additional methods.\
java 通过创建一个初始类开始启动。这个初始类使用`bootstrap`loader。Java虚拟机然后连接这个初始类，初始化它，并调用公共的`main`方法。这个方法的调用推动了更进一步的执行。构成main方法的java虚拟机指令可能导致更多的类、接口以及额外的方法连接和最终创建。
***
- 概述\
类加载是Java程序运行的第一步。由于Java的跨平台性，经过编译的Java源程序并不是一个可执行程序，而是一个或多个类文件。当Java程序需要使用某个类时，JVM会确保这个类已经被**加载、连接（验证、准备和解析）和初始化**。
- **类加载器分类**\
类的加载是由类加载器完成的，类加载器包括：根加载器（BootStrap）、扩展加载器（Extension）、系统加载器（System）和用户自定义类加载器（java.lang.ClassLoader的子类）
    - **bootstrap loader**
        1. loads platform classes (such as java.lang.Object, java.lang.Thread etc); loads classes from rt.jar (`$JRE_HOME/lib/rt.jar`).
        2. `-Xbootclasspath` may be used to alter the boot class path. `-Xbootclasspath/p:` and `-Xbootclasspath/a:` may be used to prepend/append additional bootstrap directories - have extreme caution doing so. In most scenarios, you want to avoid playing with boot class path.
        3. This loader is represented by Java null. i.e.,（也就是，亦即） For example,`java.lang.Object.class.getClassLoader()` would return null (and so for other bootstrap classes such as java.lang.Integer, java.awt.Frame, java.sql.DriverManager etc.)\
        `bootstrap`通过`java.lang.Object.class.getClassLoader`获取时将返回null.
        5. In Sun's implementation, the read-only System property `sun.boot.class.path` is set to point to the boot class path.Note that you can not change this property at runtime - if you change the value that won't be effective.
    - **extension class loader**
        1. loads classes from jar files under `$JRE_HOME/lib/ext`directory.
        2. System property `java.ext.dirs` may be set to change the extension directories using **`-Djava.ext.dirs`** command line option.
        3. Programmatically, you can read (only-read!) System property `java.ext.dirs` to find which directories are used as extension directories. Note that you can not change this property at runtime - if you change the value that won't be effective.
        4. In Sun's implementation, this is an instance of `sun.misc.Launcher$ExtClassLoader` (actually it is an inner class of `sun.misc.Launcher class`).
    - **application class loader**
        1. Loads classes from application classpath. Application classpath is set using
            - Environment variable `CLASSPATH` (or)
            - `-cp` or `-classpath` option with Java launcher
        2. If both `CLASSPATH` and `-cp` are missing, "." (current directory) is used.
        3. The read-only System property `java.class.path` has the value of
           application class path. Note that you can not change this property at runtime - if you change the value that won't be effective.
        4. `java.lang.ClassLoader.getSystemClassLoader()` returns this loader.
        5. This loader is also (confusingly) called as "system class loader" - not to be confused with bootstrap loader which loads Java "system" classes.
        6. This is the loader that loads your Java application's "main" class (class with main method in it).
        7. In Sun's implementation, this is an instance of `sun.misc.Launcher$AppClassLoader` (actually it is an inner class of sun.misc.Launcher class).
        8. **The default application loader** uses extension loader as it's parent loader.
        9. You can change the application class loader by command line option **`-Djava.system.class.loader`**. This value specifies name of a subclass of `java.lang.ClassLoader` class. First the default application
        loader loads the named class (and so this class has to be in CLASSPATH or -cp) and creates an instance of it. The newly created loader is used to load application main class.
    - JVM中默认的类加载器有哪些？\
    java虚拟机中可以安装多个类加载器,系统默认三个主要的类加载器,每个类加载器负责加载不同位置的类:**`BootStrap`,`ExtClassLoader`,`AppClassLoader`**
        1. 类加载器本身也是一个java类,因为类加载器本身也是一个java类,那么这个特殊的java类【类加载器】是有谁加载进来的呢?这显然要有第一个类加载器，这第一个类加载器不是一个java类，它是BootStrap。
        2. BootStrap不是一个java类，不需要类加载器加载，他是嵌套在java虚拟机内核里面的。java 虚拟机内核已启动的时候，他就已经在那里面了，他是用c++语言写的一段二进制代码。他可以去加载别的类，其中别的类就包含了类加载器(如上面提到的`ExtClassLoader`和`AppClassLoader`)
    - **举个例子**
```Java
    public class ClassLoaderTest {
        public static void main(String[] args) {
            System.out.println("----------AppClassLoader-------------");
            //加载main方法的加载器
            ClassLoader classLoader = ClassLoaderTest.class.getClassLoader();
            //获取该对象的类加载器
            System.out.println(classLoader);
            //类加载器也是一个java类，可以打印名称
            System.out.println(classLoader.getClass().getName());
            //获取对象加载器的另外一种方式
            System.out.println(java.lang.ClassLoader.getSystemClassLoader());
            System.out.println("----------ExtClassLoader-------------");
            System.out.println(classLoader.getParent());
            System.out.println("----------Bootstrap----------------");
            System.out.println(classLoader.getParent().getParent());
            //Object对象的类加载器
            System.out.println(Object.class.getClassLoader());
            //基础类加载器
            System.out.println(ArrayList.class.getClassLoader());
        }
    }/*
    ----------AppClassLoader-------------
    sun.misc.Launcher$AppClassLoader@18b4aac2
    sun.misc.Launcher$AppClassLoader
    sun.misc.Launcher$AppClassLoader@18b4aac2
    ----------ExtClassLoader-------------
    sun.misc.Launcher$ExtClassLoader@1540e19d
    ----------Bootstrap----------------
    null
    null
    null
    *///~
  ```
  **结果分析**    ClassLoaderTest的类加载器的名称是AppClassLoader。也就是说这个类是由AppClassLoader这个类加载器加载的。System/ArrayList的类加载器是null。这说明这个类加载器是由BootStrap加载的。因为我们上面说了BootStrap不是java类，不需要类加载器加载。所以他的类加载器是null。\
  我们说了java给我们提供了三种类加载器：BootStrap，ExtClassLoader，AppClassLoader。这三种类加载器是有父子关系组成了一个树形结构。BootStrap是根节点，BootStrap下面挂着ExtClassLoader，ExtClassLoader下面挂着AppClassLoader.
  ![AdapterPattern](https://github.com/Fulun/blog/blob/master/images/classloaderrelation.jpg)\
  
  每一个类加载器都有自己的管辖范围。BootStrap根节点，只负责加载rt.jar里的类; ExtClassLoader负责加载`JRE/lib/ext/*.jar`这个目录下的文件; 而AppClassLoader负责加载ClassPath目录下的所有jar文件。最后一级是我们自定义的加载器，他们的父类都是AppClassLoader。





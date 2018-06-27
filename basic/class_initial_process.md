#### 类初始化顺序
1. 先加载执行父类的静态变量及静态初始化块(执行先后顺序按排列的先后顺序)
2. 再加载执行本类的静态变量及静态初始化块
只要类没有被销毁，静态变量及静态初始化块只会执行1次，后续再对该类进行其他操作也不会再执行这两个步骤

#### 类实例创建过程
调用new方法创建类的实例
1. 按照上面“类初始化顺序”（类已被加载则跳过此步）。
2. 父类的非静态变量及非静态初始化块。
3. 父类的构造方法
4. 本类的非静态变量及非静态初始化块
5. 本类的构造方法
6. 类实例销毁时候，首先销毁子类部分，再销毁父类部分
#### 举个例子
```Java
//父类
public class StaticFieldTest {

    private String str = "123";
    private static int number = 5;
    private static int staticBlock = 0;

    static {
        staticBlock = 1;
    }

    public StaticFieldTest() {
        str = "helloworld";
    }
}
//子类
public class childClass extends  StaticFieldTest {
    private String str = "wfl";
    private static String str2 = "gf";

    static {
        str2 = "xb";
    }
    public childClass(){
        str = "za";
    }
}
//测试类
public class TestClass {
    public static void main(String[] args) {
        new StaticFieldTest();
        new StaticFieldTest();

        new childClass();
        new childClass();
    }
}
```
#### static关键字
是一个修饰符，用于修饰成员（成员变量和成员函数）\
被修饰后的成员具备以下特点：\
**随着类的加载而加载**（类一加载，静态数据就立即在内存中加载空间）\
随着类的消失而消失，说明它的**生命周期最长**\
优先于对象存在（对象消失了，static还在）\
静态先存在，对象后存在\
被所有对象所共享

***
#### 什么是类加载机制？
JVM把class文件加载到内存里面，并对数据进行校验、准备、解析和初始化，最终能够被形成被JVM可以直接使用的Java类型的过程。
#### 类加载流程图
![class loading](https://github.com/Fulun/blog/blob/master/images/process_class_loading.png)\

- 加载（loading）
	找到某个类或接口的二进制表示，然后根据二进制表示创建类或接口的过程。
- 链接（linking）\
	链接就是将Java类的二进制代码合并到java的运行状态中的过程。
    - 验证（verification）\
	Verification of a Java class file is the process of checking that the class file is structurally well-formed and then inspecting the class file contents to ensure that the code does not attempt to perform operations that are not permitted.\
    确保加载的类符合JVM规范与安全。（比如说final不能继承）
    - 准备 (Preparation)
    Preparation involves the allocation and default initialization of storage space for static class fields. Preparation also creates method tables, which speed up virtual method calls, and object templates, which speed up object creation.\
    为static变量在方法区中分配空间，设置变量的初始值。例如static int a=3，在此阶段会a被初始化为0。注意是初始值。    
    - 解析（resolution）\
    虚拟机将常量池的符号引用转变成直接引用。例如"aaa"为常量池的一个值，直接把"aaa"替换成存在于内存中的地址。\
    Java 中，虚拟机会为每个加载的类维护一个常量池【不同于字符串常量池，这个常量池只是该类的字面值（例如类名、方法名）和符号引用的有序集合。 而字符串常量池，是整个JVM共享的】这些符号（如int a = 5;中的a）就是符号引用，而解析过程就是把它转换成指向堆中的对象地址的相对地址。
- 初始化（initialization）\
Initialization involves the processing of the class's class initialization method, if defined, at which time static class fields are initialized to their user-defined initial values (if specified).  
***
- 类加载器总结\
Java 中的类加载器大致可以分成两类，一类是系统提供的，另外一类则是由 Java 应用开发人员编写的.   
引导类加载器（bootstrap class loader）：\
它用来加载 Java 的核心库(jre/lib/rt.jar)，是用原生C++代码来实现的，并不继承自java.lang.ClassLoader。\
加载扩展类和应用程序类(应用程序类又叫系统类)加载器，并指定他们的父类加载器，在java中获取不到。 \
扩展类加载器（extensions class loader）：\
它用来加载 Java 的扩展库(`jre/ext/*.jar`)。Java 虚拟机的实现会提供一个扩展库目录。该类加载器在此目录里面查找并加载 Java 类。 \
系统类加载器（system class loader）：\
它根据 Java 应用的类路径（CLASSPATH）来加载 Java 类。一般来说，Java 应用的类都是由它来完成加载的。可以通过 ClassLoader.getSystemClassLoader()来获取它。\
自定义类加载器（custom class loader）：\
除了系统提供的类加载器以外，开发人员可以通过继承 java.lang.ClassLoader类的方式实现自己的类加载器，以满足一些特殊的需求。
- Ref\
https://www.cnblogs.com/qiuyong/p/6407418.html?utm_source=itdadao&utm_medium=referral \
https://www.cnblogs.com/sunniest/p/4574080.html \

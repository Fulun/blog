#### Ref
https://www.youtube.com/watch?v=ZBJ0u9MaKtM
#### 举个例子
Edit MyApp.java  //编辑  
javac MyApp.java //编译  
java MyApp  //运行 https://www.cnblogs.com/dongling/p/5418917.html  
当你通过命令行运行“java MyApp”的时候，你就创建了一个JVM instance  
![JVM Instance](https://github.com/Fulun/blog/blob/master/images/JVM_Arch/JVM_Instance.bmp)  
class loader 负责加载你的应用程序的start class files.上边这个例子中，classloader负责加载MyApp.class文件。它还不得不加载这个类中用到的Java API。  
加载的class(基本的字节序指令)被提供给执行引擎，执行引擎和底层的操作系统打交道，将指令转为操作系统指令。  
![JVM summary](https://github.com/Fulun/blog/blob/master/images/JVM_Arch/JVM_Summary.bmp)  
#### JMM（Java Memory Model）
JVM架构细分为三个部分： Class loader subsystem, Runtime data areas, 执行引擎。  
Runtime data areas又可以细分为5个部分，分别是，Method Area, Heap, Java Stacks, PC Registers, Native Method Stacks.  
![JVM parts](https://github.com/Fulun/blog/blob/master/images/JVM_Arch/JVM_parts.bmp)
***  
- **Class loader subsystem**  
![JVM loader](https://github.com/Fulun/blog/blob/master/images/JVM_Arch/JVM_loader.bmp)  
类加载过程可以细分为3个阶段，load--link--initialize  
**load**： is responsible for loading the byte-code in the memory. 所以loading 从不同的路径下加载.class的字节码。以上边的例子为例，class loader 从文件系统读取myApp.class，当然class loader也可以从.jar文件中读取class字节码，也可能是从其他路径下读取, 比如说从network socket, 这取决与class loader的实现。  
JVM提供三种class loader。分别是：Bootstrap class loader, Extension class loader and Application class loader。其中:
    - Bootstrap class loader 负责加载java internal class. Java internal Class位于rt.jar  
    - Extention class loader 负责加载jre\lib\ext目录下额外的application jars.  
    - Application class loader 负责加载环境变量CLASS PATH指定路径下的class文件。通过指定-cp参数改变加载路径。

    **Link也划分为三个阶段：**  
    - **Verify** : 校验字节序是否满足JVM规范。  
    - **Prepare**：静态变量的内存在这个阶段被分配。注意这个阶段只是为类变量（也就是静态变量，不是对象变量）分配内存，分配的内存被赋为默认值（default value ,注意不是初始值）。 比如private static int var = 5; 这个阶段，var被赋值为0，而不是5。当然若变量定义为final变量，则就赋值为5了。  
    - **Resolve**：所以当前类的符号引用（symbolic references inside the current class are resolved）被解析。比如说，你有指向其他类的的引用（suppose you have a reference to other classes or reference just to values in constant pool）或者指向常量池的引用（private String str = "123"）,(these are changed from symbolic to the actual reference),这些符号引用被改变为实际引用。 
 so though it's like depicted in a serial fasion like Verify, Prepare and Resolve. This might get executed slightly in parallel or you know it might overlap in functionality to certain extent sometimes based on the implementation 虽然link看似可以被串行的划分为 Verify, Prepare 和Resolve三个阶段。实际上，执行过程可能轻微地并行 或者某些时候，三者的功能可以会有一定的重叠，这取决于虚拟机的实现。

    **Initialize阶段**:  
（it is the phase their static initializers of your class ）这个阶段，你的类完成了静态属性/block的初始化（prepare阶段的只是分配内存并初始化为默认值，这个阶段就赋为初始值了）举个例子：  
	```Java
	class StaticInit
	{
		 private static int var = 5; 
		 public static int x;	 
		 static	 
		 {	 
		  	x = 32;	 
		 }
		// other class members such as constructors and
		// methods go here...
	}
	```
    任何处在static代码块中的片段都会在这个阶段（Initialize）被执行，static variables会被赋为初始值（var被赋值为5）  
    关于上述的load, link, initialize三个阶段一些有趣的事情：  
    loading时的异常:  
	1. class not found exception: class loader fails to find the bytecode corresponding to a class we mentioned.  
	2. clas def not found: generally happens during a resolve. 比如正在加载类X, 类X包含一个指向类Y的引用，resolve阶段，系统尝试去找到class Y(因为x引用了Y),若Y找不到，则抛出class def not found for X which wraps class no found exception for Y  
***
- **Runtime data areas**  
![Runtime data areas](https://github.com/Fulun/blog/blob/master/images/JVM_Arch/Runtime_data_areas.bmp)  
**元数据(meta data)**——“data about data” 关于数据的数据，元数据是指从信息资源中抽取出来的用于说明其特征、内容的结构化的数据(如题名,版本、出版数据、相关说明,包括检索点等)，用于组织、描述、检索、保存、管理信息和知识资源。  
`String str = new String("hello");`  
上面的语句中变量str放在栈上，用new创建出来的字符串对象放在堆上，而"hello"这个字面量是放在方法区的。 
	```Java
	String s1 = "Hello";
	String s5 = new String("Hello");
	String s6 = s5.intern();
	```
    s1 == s6这两个相等完全归功于intern方法，s5在堆中，内容为Hello ，intern方法会尝试将Hello字符串添加到常量池中，并返回其在常量池中的地址，因为常量池中已经有了Hello字符串，所以intern方法直接返回地址；而s1在编译期就已经指向常量池了，因此s1和s6指向同一地址，所以相等。 
    Run-time Data Areas可以划分为5个区域：分别是，Method Area, Heap, Java Stacks, PC Registers, Native Method Stacks.  
    - **Method Area**: 放置元数据的地方。meta-data corresponding to class is stored. 
    比如说静态变量, bytecode, class-level的常量池， 字符串常量池，都保存在method area. Method    Area通常也被叫做permanent space. 默认情况下64MB大小。可以使用`-XX MaxPermSize`调整method area(永久代)的大小。设置太小，可能产生java.lang.OutOfMemoryError: PermGen Space...  
    Java 8 hotspot(java虚拟机的一种实现)虚拟机去除了Method Area(永久代)，被叫做metaspace。move method area into sperate memory in the native operating system.  
    **方法区（Method Area)与Java堆一样，是各个线程共享的内存区域**，它用于存储已被虚拟机加载的类信息、常量、静态变量、即时编译器编译后的代码等数据。 
    - **Heap 区域**  
    保存对象数据。通过``-Xms`` (minimum size)和``-Xmx`` (maximum size)调整heap区域的大小。
    - **PC Registers & Java Stacks & Native method stacks** 
    ![PC and Stacks](https://github.com/Fulun/blog/blob/master/images/JVM_Arch/pc_stack_native_method_stack.bmp)
    - **PC registers**   
    programme counter registers, 其包含programme counter (指向下一条将被指向的指令) pointer to the next instrunction to be executed per thread.如上所示，T1, T2, T3 代表 thread1 thread2 thread3线程将要执行的下一条指令。
    - **Java stacks**
    包含 stack frame corresponding to the current method execution per thread. 上如所示，从左到邮编，依次为t2 ,t2, t3的调用栈。从下向上调用。stack 包含本地变量, 调用入参，返回值等等。 
    - **Native method stack**
    上图所示，Java stack frame调用Native method stack 比如 load a dll and run something from the DLL.
    - **有趣的事情**
    递归调用，忘记设置退出条件，导致不断压栈无限循环，从而产生java.lang.StackOverflowError  
    -Xss 用来调整栈大小。
    - **Summary**  
    Method area : for class data.
	heap : for object data.
	PC registers: per thread for programm counter
	Java stack: per thread for keeping the current executing methods stack frame
	- **划重点**
	pc registers, java statck, native method stack 每个线程都是独享的。每个线程独有一份（pc register + stack +native method stack），相互隔离。method area 和heap 是线程共享的，created per JVM。意思就是说 you have one method area and one heap per JVM instance.
	***
- **执行引擎**
![Execution Engine](https://github.com/Fulun/blog/blob/master/images/JVM_Arch/execution_engine.bmp)
once data area is loaded with instruction to be executed (the current instruction to be executed is ready) what happens is that the Java Interpeter interpreters the current instruction that is then the bytecode and execute it.  
执行引擎，分为4部分：  
    - **Interpreter**: take bytecode instruction. look at it, finds out what native operation has to be done and executes that native operation. so that is done by using  native method interface which interfaces Native method libraries that are present in the JVM. 如果你查看JRE bin folder(E:\install\Java\jre1.8.0_171\bin)目录下有许多*.DLL文件。这些DLL文件都是platform-specific native libraries that is used by the execution engine
    - **JIT Compiler**: 执行引擎为了加快Java运行，做了很多优化，例如JIT 编译技术，假设我们有一些指令集，这些指令集重复执行的频率很高，这些指令将不会被一遍一遍的被interperter 器解释，instead what happens is the JIT compiler will on the fly compiles this set of instructions and keep the target machine code ready for execution so there is no more interpretation involved here. so it's only machine code execution 
    - **Hotspot profiler**: For example in this case it helps the compiler to compile frequently used instructions.
    - **GC**: 略
    ***
#### on the fly  
on the fly 相对比较常见的含义是“不经过某种额外步骤而直接进行某项活动”。  
它可以被应用于许多场景。  
如果一个驱动程序可以不重启就生效，我们可以说这是生效 on the fly。  
如果一个插件可以在主程序不重启时直接加载，我们也可以说这是加载 on the fly。  
如果光盘数据可以不经过缓存直接被刻录，我们也可以说这是刻录 on the fly。  
如果我们把产生数据和处理数据之间直接打通一个通道，就可以一边生产数据一边处理数据，而不需要把数据生产完毕之后，再进行处理，因此这叫做数据处理 on the fly。 
“on the fly” 直译为“在飞行中”，引申为在“不停机状态下（进行某项活动）”。汉语中的“即时”意思与之接近：（不管当前状态如何），立刻或马上（进行某项活动）。  
因为包含两层意思，一是即时生效，二是临时有效。 
https://www.zhihu.com/question/21136587  

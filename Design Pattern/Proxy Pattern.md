
#### 定义
[Ref](https://www.journaldev.com/1572/proxy-design-pattern) Proxy design pattern intent according to GoF is:  
**Provide a surrogate or placeholder for another object to control access to it**.提供一个对象的代理来控制访问它。  
举个例子，比如说我们有一个类用来执行系统命令。自己执行没有任何问题，如果我们把这类公开，那么如何防止客户端任意执行命令，需要提供一个代理类用来做访问控制。
```Java
//定义接口
public interface CommandExecutor {
    public void runCommand(String cmd) throws Exception;
}

//定义实现类
public class CommandExecutorImpl implements CommandExecutor {
    
    @Override
    public void runCommand(String command) throws IOException {
        //some heavy implementation
        //Runtime.getRuntime().exec(command);
        System.out.println("'" + command + "'" + " command executed");
    }
}

//定义代理类
public class CommandExecutorProxy implements CommandExecutor {
    private CommandExecutor executor;
    private boolean isAdmin;

    public CommandExecutorProxy(String user, String password) {
        if ("admin".equals(user) && "xxx".equals(password)) {
            isAdmin = true;
        }
        executor = new CommandExecutorImpl();
    }

    @Override
    public void runCommand(String command) throws Exception {
        if (isAdmin) {
            executor.runCommand(command);
        } else {
            if (command.trim().startsWith("rm")) {
                throw new Exception(
                        "rm command is not allowed for non-admin users.");
            } else {
                executor.runCommand(command);
            }
        }
    }

    public static void main(String[] args) {
        CommandExecutorProxy cmdProxy = new CommandExecutorProxy("admin", "ee");
        try {
            cmdProxy.runCommand("ls -l");
            cmdProxy.runCommand("rm -rf *");
        } catch (Exception e) {
            System.out.println("Exception Msg:" + e.getMessage());
        }
    }
}/*
'ls -l' command executed
Exception Msg:rm command is not allowed for non-admin users.
*///~
```

#### 动态代理
```Java
public class CommandExecutorDynamicProxy implements InvocationHandler {

    private CommandExecutor executor;
    private boolean isAdmin = false;

    public CommandExecutorDynamicProxy(String userName, CommandExecutor executor) {
        if ("admin".equals(userName)) {
            isAdmin = true;
        }
        this.executor = executor;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args)
            throws Throwable {
        if (isAdmin) {
            return method.invoke(executor, args);
        } else {
            if ("runCommand".equals(method.getName()) && args.length > 0
                    && args[0] instanceof String) {
                if (((String) args[0]).trim().startsWith("rm")) {
                    throw new Exception(
                            "rm command is not allowed for non-admin users.");
                } else {
                    return method.invoke(executor, args);
                }
            }
            return null;
        }
    }

    public static void main(String[] args) {
        CommandExecutor executor = new CommandExecutorImpl();
        CommandExecutorDynamicProxy exeProxy = new CommandExecutorDynamicProxy(
                "123", executor);
        CommandExecutor cmdProxy = (CommandExecutor) Proxy.newProxyInstance(
                executor.getClass().getClassLoader(), executor.getClass()
                        .getInterfaces(), exeProxy);
//      CommandExecutor cmdProxy = (CommandExecutor) Proxy.newProxyInstance(
//              executor.getClass().getClassLoader(), new Class[]{CommandExecutor.class}, exeProxy);
        try {
            cmdProxy.runCommand("ls -l");
            cmdProxy.runCommand("rm -rf *");
        } catch (Exception e) {
            System.out.println("Exception Msg:" + e.getMessage());
        }
    }
}/*
'ls -l' command executed
Exception Msg:rm command is not allowed for non-admin users.
*///~
```
Proxy.newProxyInstance方法第二个参数可以替换成`new Class[]{CommandExecutor.class}`; 动态代理需要实现`InvocationHandler`接口，需要持有被代理对象的引用。例如：`private CommandExecutor executor`; `invoke`方法中可以通过`method.getName()`方法对需要调用的接口做控制。
比如说由于权限的问题，不允许访问那些方法；动态代理不需要和实现类一样，实现相同的接口。
#### CGLIB proxy
JDK 动态代理要求被代理的类必须实现一个或者多个接口。如上所示，必须实现CommandExecutor接口，因为构造代理对象时，第二个参数需要用到这个接口信息。
```Java
CommandExecutor cmdProxy = (CommandExecutor) Proxy.newProxyInstance(
      executor.getClass().getClassLoader(), new Class[]{CommandExecutor.class}, exeProxy);
```
如果你想代理一般的类，那么你可以使用CGLIB library。\
CGLIB是一个功能强大的，高性能的code generation library. 其广泛的应用于基于代理的AOP（Aspect oriented Programming）框架，例如Spring AOP 和dynaop， 提供了method interceptions的能力。Hibernate, 最流行的object-relational mapping tool，也使用CGLIB库代理single-ended (many-to-one and one-to-one)associations；EasyMock 和 jMock use the CGLIB library to create mock objects for classes that do not have interfaces.

CGLIB底层使用ASM，一个小但是很快的字节码操作框架，将已存在的字节码转换、生成新的classes, 除了CGLIB库，脚本语言，例如groovy、和BeanShell也使用ASM去生成JAVA字节码。ASM使用类似于SAX parser的机制实现高性能（ASM uses a SAX parser like mechanism to achieve high performance.）不建议直接使用ASM。
因为这需要对JVM有较深入的理解，包括class file format 和指令集（instruction set）
![CGLIB](https://github.com/Fulun/blog/blob/master/images/CGLIB.PNG)
上图显示了CGLIB和相关的框架和语言的关系。**注意**某些框架，例如Spring AOP 和Hibernate，二者同时使用CGLIB库和JDK动态代码去meet their needs。Hibernate用JDK动态代理实现了一个transaction manager adapter for the WebShere application server； Spring AOP 默认情况下，使用JDK动态代理去代理接口，除非你通过配置强制使用CGLIB proxy。

CGLIB库是一个基于ASM的high-level layer. 代理没有实现接口的普通类非常有用。**本质上**，他动态产生了一个代理类的子类，复写了父类的non-final的方法。同时“连接”了“钩子”。这些钩子可以回调用户定义的interceptors。相比于JDK动态代码，CGLIB更快。



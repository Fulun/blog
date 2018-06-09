
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


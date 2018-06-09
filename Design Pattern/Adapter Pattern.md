#### 定义  
Adapter Pattern：Convert the interface of a class into another interface clients expect.Adapter lets classes work together that couldn't otherwise because of incompatible interface.  
适配器模式：将一个类的接口转换成客户希望的另一个接口。适配器模式让那些接口不兼容的类可以一起工作
#### 模式中的角色
目标接口（Target）：客户所期待的接口。  
需要适配的类（Adaptee）：需要适配的类。  
适配器（Adapter）：通过包装一个需要适配的对象，把原接口转换成目标接口。
#### 实现方式  
类的适配器模式（采用继承实现）  
对象适配器（采用对象组合方式实现）  
#### 类适配器UML
![AdapterPattern](https://github.com/Fulun/blog/blob/master/images/AdapterPattern.jpg)
```Java
public interface Target {
	public void request();
}

public class ConcretTarget implements Target {
	@Override
	public void request() {
		System.out.println("普通类 具有 普通功能...");
	}
}

public class Adaptee {
	public void SpecificRequest() {
		System.out.println("被适配类具有 特殊功能...");
	}
}

public class Adapter extends Adaptee implements Target{
	@Override
	public void request() {
		super.SpecificRequest();
	}
}

public class Client {
	public static void main(String[] args) {
		Target conTarget = new ConcretTarget();
		conTarget.request();
		Target adpter = new Adapter();
		adpter.request();
	}
}/*
普通类 具有 普通功能...
被适配类具有 特殊功能...
*///~
```
调用的接口没有变化（xx.request()），适配器只是做了适配, 将Adaptee适配成了客户期待的接口。  
#### 对象适配器UML  
![AdapterPattern](https://github.com/Fulun/blog/blob/master/images/AdapterPattern_1.jpg)
```Java
public class Adapter_1 implements Target {

	private Adaptee adaptee;
	//通过构造函数传入具体需要适配的被适配类对象 
	public Adapter_1(Adaptee adaptee) {
		this.adaptee = adaptee;
	}
	@Override
	public void request() {
		// 这里是使用委托的方式完成特殊功能
		adaptee.SpecificRequest();
	}
	public static void main(String[] args) {
		Target conTarget = new ConcretTarget();
		conTarget.request();
		Target adpter = new Adapter_1(new Adaptee());
		adpter.request();
	}
}
```


#### 定义  
Adapter Pattern：Convert the interface of a class into another interface clients expect.Adapter lets classes work together that couldn't otherwise because of incompatible interface.  
适配器模式：将一个类的接口转换成客户希望的另一个接口。适配器模式让那些接口不兼容的类可以一起工作
#### 模式中的角色
目标接口（Target）：客户所期待的接口。  
需要适配的类（Adaptee）：需要适配的类。也叫做适配者类。
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
![AdapterPattern](https://github.com/Fulun/blog/blob/master/images/AdapterPattern-1.jpg)
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
#### 缺醒适配器模式
缺醒适配器模式(Default Adapter Pattern)：当不需要实现一个接口所提供的所有方法时，可先设计一个抽象类实现该接口，并为接口中的每个方法提供一个默认实现(空方法)，那么该抽象类可以有选择性的覆盖父类的某些方法来实现需求，它适用于不想使用一个接口中的所有方法的情况，又称为单接口适配器模式。
![AdapterPattern](https://github.com/Fulun/blog/blob/master/images/defaultAdapterPattern.png)  
由图可知，在缺醒适配器模式中，包含以下三个角色：
- ServiceInsterface(适配者接口)：它是一个接口，通常在该接口中声明了大量的方法。
- AbstractServiceClass(缺醒适配器类)：它是缺醒适配器模式的核心类，使用空方法的形式实现了ServiceInterface接口中声明的方法。通常将它定义为抽象类，因为对它进行实例化也没有任何意义。
- ConcreteServiceClass(具体业务类)：它是缺醒适配器的子类，在没有引入适配器之前，它需要实现适配者接口，因此需要实现在适配者接口中生命的所有方法，而对于一些无需使用的方法不得不提供空实现。有了缺醒适配器之后，可以直接继承该适配器类，根据需要有选择性的覆盖配置器类中定义的方法。
#### 双向适配器
在对象适配器中如果同时包含目标类和适配者类的引用，适配者可以通过它调用目标类中的方法，目标类也可以通过它调用适配者类中的方法，那么该适配器就是一个双向适配器。
![AdapterPattern](https://github.com/Fulun/blog/blob/master/images/bidirectionalAdapter.png)
***
#### Reference
https://blog.csdn.net/jason0539/article/details/22468457  
https://www.cnblogs.com/songyaqi/p/4805820.html


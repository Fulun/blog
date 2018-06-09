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
#### 类图  
![1111](images/类适配器模式.png)

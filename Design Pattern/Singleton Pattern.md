To implement Singleton pattern, we have different approaches but all of them have following common concepts.
- Private constructor to restrict instantiation of the class from other classes. 私有构造函数
- Private static variable of the same class that is the only instance of the class.相同类型的私有静态属性。
- Public static method that returns the instance of the class, this is the global access point for outer world to get the instance of the singleton class. 提供一个对外的公共静态方法，返回这个静态的私有属性。

1. **Eager initialization**

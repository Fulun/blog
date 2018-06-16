### Introduction
To understand the Decorator Design Pattern, let’s help a pizza company make an extra topping calculator. A user can ask to add extra topping to a pizza and our job is to add toppings and increase its price using the system.  
为了理解装饰器设计模式，我们设想这样的场景，帮助pizza店制作一个计算器，当用户需要一个pizza, 在此基础上加芝士、加奶酪、加火腿等等后，计算其价格。 
This is something like adding an extra responsibility to our pizza object at runtime and the Decorator Design Pattern is suitable for this type of requirement. But before that, let us know more about this beautiful pattern. 
### What is the Decorator Design Pattern
The intent of the Decorator Design Pattern is to attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to sub-classing for extending functionality.  
装饰器模式的目的是给对象动态的附加额外的功能。他为通过子类扩展功能，提供了一种灵活的替代品。  
The Decorator Pattern is used to extend the functionality of an object dynamically without having to change the original class source or using inheritance. This is accomplished by creating an object wrapper referred to as a **Decorator** around the actual object.  
装饰器模式动态的扩展对象的功能，不需要改变原对象或者使用继承。通过创建一个被称作Decorator的包装类around the actual object。  
The Decorator object is designed to have the same interface as the underlying object. This allows a client object to interact with the Decorator object in exactly the same manner as it would with the underlying actual object. The Decorator object contains a reference to the actual object. The Decorator object receives all requests (calls) from a client. In turn, it forwards these calls to the underlying object. The Decorator object adds some additional functionality before or after forwarding requests to the underlying object. This ensures that the additional functionality can be added to a given object externally at runtime without modifying its structure.  
装饰器和被装饰对象实现了相同的接口。这就允许客户端可以使用相同的方式和装饰器通信。装饰器类包含一个到原对象的引用。从client接收的任何请求都会被转发给实际的对象。同时，在转发前后附加了自身额外的功能。这就确保了这些额外的功能是在运行时，通过外部附加上去的，而不需要修改原对象的结构。  
Decorator prevents the proliferation of subclasses leading to less complexity and confusion. It is easy to add any combination of capabilities. The same capability can even be added twice. It becomes possible to have different decorator objects for a given object simultaneously. A client can choose what capabilities it wants by sending messages to an appropriate decorator.  
装饰器阻止了子类的“繁衍”，从而降低了代码的复杂度和困惑。同一个对象同时有多个不同的装饰对象。  
### Class Diagram
![Decorator](https://github.com/Fulun/blog/blob/master/images/Decorator.PNG)
- ConcreteComponent   
    - Defines an object to which additional responsibilities can be attached.(需要被装饰的对象)
- Decorator  
    - Maintains a reference to a Component object and defines an interface that conforms to Component’s interface.(包含`Component`的引用，同时继承自该接口)
- ConcreteDecorator  
    - Adds responsibilities to the component.
### Implementing the Decorator Design Pattern
```Java
public interface Pizza {
    public String getDesc();

    public double getPrice();
}
//素披萨
public class SimpleVegPizza implements Pizza {
    @Override
    public String getDesc() {
        return "SimplyVegPizza (230)";
    }

    @Override
    public double getPrice() {
        return 230;
    }
}
//非素披萨
public class SimplyNonVegPizza implements Pizza {

    @Override
    public String getDesc() {
        return "SimplyNonVegPizza (350)";
    }

    @Override
    public double getPrice() {
        return 350;
    }
}
//装饰类
public abstract class PizzaDecorator implements Pizza {
    @Override
    public String getDesc() {
        return "Toppings";
    }
}
//西蓝花
public class Broccoli extends PizzaDecorator {
    private final Pizza pizza;

    public Broccoli(Pizza pizza) {
        this.pizza = pizza;
    }

    @Override
    public String getDesc() {
        return pizza.getDesc() + ", Broccoli (9.25)";
    }

    @Override
    public double getPrice() {
        return pizza.getPrice() + 9.25;
    }
}
//奶酪
public class Cheese extends PizzaDecorator {

    private final Pizza pizza;

    public Cheese(Pizza pizza) {
        this.pizza = pizza;
    }

    @Override
    public String getDesc() {
        return pizza.getDesc() + ", Cheese (20.72)";
    }

    @Override
    public double getPrice() {
        return pizza.getPrice() + 20.72;
    }
}
//青梅子
public class GreenOlives extends PizzaDecorator {
    private final Pizza pizza;

    public GreenOlives(Pizza pizza) {
        this.pizza = pizza;
    }

    @Override
    public String getDesc() {
        return pizza.getDesc() + ", Green Olives(5.57)";
    }

    @Override
    public double getPrice() {
        return pizza.getPrice() + 5.57;
    }
}
//Test
public class TestDecoratorPattern {
    public static void main(String[] args) {
        DecimalFormat decimalFormat = new DecimalFormat("#.##");
        Pizza pizza = new SimpleVegPizza();
        pizza = new Broccoli(pizza);
        pizza = new Cheese(pizza);
        pizza = new GreenOlives(pizza);
        pizza = new GreenOlives(pizza);
        System.out.println(pizza.getDesc());
        System.out.println("Total prices:" + decimalFormat.format(pizza.getPrice()));
    }
}/*
SimplyVegPizza (230), Broccoli (9.25), Cheese (20.72), Green Olives(5.57), Green Olives(5.57)
Total prices:271.11
*///~
```
这里只扩展了素披萨。同样的非素披萨也可以装饰多个属性。  
In the above class, first we have created a SimplyVegPizza and then decorated it with Broccoli, Cheese,
and GreenOlives. The desc in the output shows the toppings added in the SimplyVegPizza and the price are the sum of all.  
上边的例子中，我们首先创建了`SimplyVegPizza`类，然后通过`Broccoli`和`Cheese`以及`GreenOlives`装饰。通过日志我们可以看到"佐料"被添加到`SimplyVegPizza`类上，价格是他们的总和。  
Please note that you can decorate the same thing more than once for an object. In the above example, we added GreenOlives twice;  
注意观察，我们可以装饰多个同样的“佐料”
到同一对象上。在这个例子中，我们将GreenOlives附加了两次，这点从输出结果中可以看出。  
### Decorator Design Pattern in Java  
- java.io.BufferedInputStream(InputStream)  
- java.io.DataInputStream(InputStream)   
- java.io.BufferedOutputStream(OutputStream)
- java.util.zip.ZipOutputStream(OutputStream)
- java.util.Collections#checked[List|Map|Set|SortedSet|SortedMap]()



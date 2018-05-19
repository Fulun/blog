#### Perfect HashMap Key
- using **immutable, final object** with proper **_equals()_** and **_hashcode()_** implementation would act as perfect Java HashMap keys and **improve the performance of Java HashMap by reducing collision**.\
使用final、不可变的对象最为HashMap的key
- suggest that [String](http://javarevisited.blogspot.sg/2011/07/string-vs-stringbuffer-vs-stringbuilder.html) and various wrapper classes e.g. Integer very good keys in Java HashMap.
***
#### What happens On HashMap in Java if the size of the HashMap exceeds a given threshold defined by load factor？
- If the size of the Map exceeds a given threshold defined by **load-factor** e.g. if the load factor is .75 it will act to re-size the map once it filled 75%.\
超过"load-factor"，就会re-size。
- Similar to other collection classes like [ArrayList](http://javarevisited.blogspot.sg/2011/05/example-of-arraylist-in-java-tutorial.html)Java HashMap re-size itself by creating a new bucket array of size twice of the previous size of HashMap and then start putting every old element into that new bucket array. This process is called **rehashing** because it also applies the hash function to find new bucket location.\
ArrayList机理类似。re-size：重新创建一个大小是原来的2倍的bucket， 然后开始把老的element方到新的bucket数组中。这个过程叫做rehashing。
- do you see any problem with resizing of HashMap in Java?

    - there is potential [race condition](http://javarevisited.blogspot.sg/2012/02/what-is-race-condition-in.html) exists while resizing HashMap in Java, if two [thread](http://javarevisited.blogspot.sg/2011/02/how-to-implement-thread-in-java.html) at the same time found that now HashMap needs resizing and they both try to resizing.
    - If race condition happens then you will end up with an infinite loop. 不太理解。




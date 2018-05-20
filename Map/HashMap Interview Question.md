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
***
#### Why String, Integer and other wrapper classes are considered good keys?
- String, Integer and other wrapper classes are natural candidates of HashMap key, and String is most frequently used key as well because  [String is immutable and final](http://javarevisited.blogspot.sg/2010/10/why-string-is-immutable-in-java.html), and overrides equals and hashcode() method. Other wrapper class also shares similar property.\
因为String是immutable和final的，同时复写了equals和Hashcode方法。
- Immutability is required, in order to prevent changes on fields used to calculate hashCode(). because if key object returns different hashCode during insertion and retrieval than it won't be possible to get an object from HashMap.
- Immutability is best as it offers other advantages as well like [thread-safety](http://javarevisited.blogspot.sg/2012/01/how-to-write-thread-safe-code-in-java.html).
***
#### Can we use any custom object as a key in HashMap?
Of course you can use any Object as key in JavaHashMap provided it follows equals and hashCode contract and its hashCode should not vary once the object is inserted into  [Map](http://javarevisited.blogspot.sg/2011/12/how-to-traverse-or-loop-hashmap-in-java.html). If the custom object is Immutable then this will be already taken care because you can not change it once created.\
当然可以。前提是作为key的Object需要遵循equals和hashcode的约束（都必须复写）。一旦key插入Map，key的hashcode就不能变了。
***
#### Can we use ConcurrentHashMap in place of Hashtable?
Since we know Hashtable is synchronized but ConcurrentHashMap provides better concurrency by only locking portion of map determined by concurrency level. ConcurrentHashMap is certainly introduced as Hashtable and can be used in place of it, but Hashtable provides stronger thread-safety than ConcurrentHashMap.\
当然可以。HashTable是线程同步。而ConcurrentHashMap提供更好的并发特性。因为后者只锁Map的部分代码。Hashtable提供更强的thread-safety。
***
#### How null key is handled in HashMap? Since equals() and hashCode() are used to store and retrieve values, how does it work in case of the null key?
The *null* key is handled specially in HashMap. there are two separate methods for that ***putForNullKey(V value)*** and **_getForNullKey()_**(这两个方法都是offloaded verion，个人理解应该是已经不用的方法，JDK1.7之前应该还在用，[源码参考](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/6-b14/java/util/HashMap.java#HashMap.putForNullKey%28java.lang.Object%29))Null keys always map to index 0. ***equals()*** and ***hashcode()*** method are not used in case of null keys in HashMap. 总结：
1. HashMap可以将null作为key 和value。
2. HashMap的get(key)方法返回null。一种可能是没有这个key-value对，也有可能是value本身就是null。此时可以通过containKey(Object)方法判断key是否存在。\
2.1 Returns the value to which the specified key is mapped, or null if this map contains no mapping for the key.
More formally, if this map contains a mapping from a key ***k*** to a value ***v*** such that *(key\==null ? k==null : key.equals(k))*, then this method returns ***v***; otherwise it returns ***null***. (There can be at most one such mapping.)
**A return value of *null* does not necessarily indicate that the map contains no mapping for the key; it's also possible that the map explicitly maps the key to ***null***. The containsKey operation may be used to distinguish these two cases**.
3. equals 和hashcode方法不用在key等于null的场景。如下代码截取自 [源码参考](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/6-b14/java/util/HashMap.java#HashMap.putForNullKey%28java.lang.Object%29))
```Java
private V getForNullKey() {
	if (size == 0) {
		return null;
	}
	for (Entry<K,V> e = table[0]; e != null; e = e.next) {
		if (e.key == null)
			return e.value;
	}
	return null;
}
```


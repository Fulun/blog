---


---

<h4 id="perfect-hashmap-key">Perfect HashMap Key</h4>
<ul>
<li>using <strong>immutable, final object</strong> with proper <strong><em>equals()</em></strong> and <strong><em>hashcode()</em></strong> implementation would act as perfect Java HashMap keys and <strong>improve the performance of Java HashMap by reducing collision</strong>.<br>
使用final、不可变的对象最为HashMap的key</li>
<li>suggest that <a href="http://javarevisited.blogspot.sg/2011/07/string-vs-stringbuffer-vs-stringbuilder.html">String</a> and various wrapper classes e.g. Integer very good keys in Java HashMap.</li>
</ul>
<h4 id="what-happens-on-hashmap-in-java-if-the-size-of-the-hashmap-exceeds-a-given-threshold-defined-by-load-factor？">What happens On HashMap in Java if the size of the HashMap exceeds a given threshold defined by load factor？</h4>
<ul>
<li>
<p>If the size of the Map exceeds a given threshold defined by <strong>load-factor</strong> e.g. if the load factor is .75 it will act to re-size the map once it filled 75%.<br>
超过"load-factor"，就会re-size。</p>
</li>
<li>
<p>Similar to other collection classes like <a href="http://javarevisited.blogspot.sg/2011/05/example-of-arraylist-in-java-tutorial.html">ArrayList</a>Java HashMap re-size itself by creating a new bucket array of size twice of the previous size of HashMap and then start putting every old element into that new bucket array. This process is called <strong>rehashing</strong> because it also applies the hash function to find new bucket location.<br>
arrayList机理类似。通过重新创建一个大小是原来的2倍的bucket来实现re-size。</p>
</li>
<li>
<p><strong>do you see any problem with resizing of HashMap in Java</strong></p>
<ul>
<li></li>
</ul>
</li>
</ul>


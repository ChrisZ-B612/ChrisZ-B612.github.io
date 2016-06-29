## IntelliJ / Webstorm 快捷键提高班
我非常喜欢研究我的开发工具，其中很重要的一块就是它的快捷键，对于我来说这是一种莫大的乐趣！我觉得熟练使用快捷键不仅仅能够提高你的开发效率，更重要的是它能给你带来一种身心愉悦的开发体验！

自从下！定！决！心！从Eclipse平台转至IntelliJ之后，我就开始了IntelliJ快捷键的研究，到目前为止也已经小有斩获，以前使用Eclipse的时候也喜欢研究它的快捷键，整体而言IntelliJ的快捷键设计肯定是要优于Eclipse的，但Eclipse也不是一无是处，起码有好几个快捷键（或者快捷使用方式）Eclipse做得要比IntelliJ要好，这也是我常常纠结的地方，如果能把它们结合一下就好了。

再声明一下，本人现在已经不做Java开发了，所以Java开发相关的快捷键并没有认真研究过，这里列出来的快捷键及键位设置都更偏向于通用的使用方式，我对部分键位做了改动以适应我的习惯，部分会标明这么改的原因，你可以从中窥见我设置快捷键的方法和思路，当然你也可以依据自己的喜好进行设置。需要强调的是：**下面列出的快捷键位很多都是被我改过之后的，键位后面的括号中有该快捷键的描述，你可以据此搜索到该快捷键以及它原来的默认键位），文末会给出我的Webstorm的Keymap设置文件（我用的是Webstorm 11），直接导入你的Webstorm即可拥有跟我相同的快捷键设置。**

废话不多说，Let's Get the Party Started.

***

#### 五星推荐
1. Ctrl + Alt + S (Settings)：打开设置弹窗，用得不能再多了。
2. Alt + W / Alt + Shift + W (Extend Selection / Shrink Selection)：这可能是使用得最多的快捷键之一了，智能选择当前光标所在处的单词，连续按的话还可以智能递增式选择，反向选择的话加Shift即可，效果如何亲自试试就知道啦！它原来的键位设置是Ctrl + W，我之所以把它改成Alt + W的一个原因是因为之前Eclipse的Ctrl + W是关闭当前标签，所以我在IntelliJ中保留了这个习惯，另一个原因是因为这个快捷键实在是太常用了，而我按Ctrl + W时需要左手抬高使用小拇指按Ctrl键，这样子用起来太费劲了，而改成Alt + W之后我随时可以用大拇指轻松地按到Alt键，然后配合无名指顺势按W键就可以完成操作了，非常的方便！
3. Backspace (Hungry Backspace)：贪婪删除，一次性删除光标之前的所有空白字符，包括换行字符。我把Backspace和Hungry Backspace的键位做了对调，从实际使用情况来讲这种调整也是极好的。
4. Ctrl + W / Ctrl + Shift + W / Ctrl + Alt + W / Ctrl + Shift + T (Close / Close All / Close Others / Reopen Closed Tab)：这个基本沿袭了我在Eclipse上的使用习惯，关闭当前标签 / 关闭所有标签 / 关闭其他标签 / 重新打开关闭标签。
5. F1 / F2 / F3 (Close / Select Previous Tab / Select Next Tab)：我习惯使用F2和F3这两个快捷键来左右切换文件，用Chrome时也是如此，毕竟它们都是需要按一个键。
6. Alt + J / Alt + Shift + J / Ctrl + Alt + Shift + J (Add Selection for Next Occurrence / Unselect Occurrence / Select All Occurrences)：这几个快捷键也是非常地棒！你可以快速地选择与当前光标高亮部分相同的地方，然后进行批量修改，比如修改一个变量或者方法什么的。
7. Alt + F1 + 7 (Show In Explorer)：是不是经常想打开当前文件所在的文件夹？以前你用的是什么方法呢？现在你有了更好的选择:)
8. Alt + Comma / Alt + Period / Alt + Slash (Basic / SmartType / Cyclic Expand Word)：传说中的三大智能补齐，可能在Java开发中用得比较多，不过我做前端开发基本用不上:(
9. Ctrl + Alt + V / Ctrl + Alt + L (Extract Variable / Inline Variable)：把选中的部分抽取出来定义成一个变量，或者把一个定义好的变量还原到引用它的地方。
10. Ctrl + Shift + Up / Ctrl + Shift + Down (Move Statement Up / Move Statement Down)：将整个逻辑代码块上移和下移，在JS和CSS文件中都可以使用，不过需要注意的是，这个快捷键有的时候不太灵光，所以用的时候要多加留心。
11. Alt + Up / Alt + Down (Move Line Up / Move Line Down)：上移或下移当前行，也被我改成了我习惯的Eclipse的键位设置。
12. Ctrl + C / Ctrl + X：复制剪切嘛，地球人谁不知道啊，这个还值当得拿出来一谈？但IntelliJ总能比我们多想一步，如果你的光标没有选中任何文本直接按这两个快捷键的话，那么就相当于对当前行做操作，也就是说你可以快速复制或剪切当前行，怎么样？还不错吧~
13. Ctrl + D / Alt + D (Delete Line / Duplicate Line or Block)：删除当前行和复制选中的文本，这两个都非常地常用，但是Alt + D相较之下更常用，所以我就把复制换成了Alt + D，IntelliJ默认的删除当前行的快捷键是Ctrl + Y，但是众所周知Ctrl + Y是经典的Redo，而IntelliJ的Redo是Ctrl + Shift + Z，虽然看起来和Ctrl + Z的Undo是成套的，但是实际操作起来不太好按，而且不符合我们的使用习惯，所以我就把Ctrl + Shift + Z去掉，然后还是把Ctrl + Y设置成Redo，再把Ctrl + D设置成删除当前行，这样就舒服多了。
14. Ctrl + Shift + L (Reformat Code)：格式化代码，IDE必备功能，不过IntelliJ会更加智能，你可以选择格式化当前文件，或者仅仅格式化当前选中的代码块什么的。
15. Ctrl + Shift + U (Toggle Case)：大小写切换。
16. Shift + F6 (Rename)：这个重命名可强大了，它不仅能为文件重命名，还能智能重命名变量，灰常地棒！虽然操作起来有点麻烦~
17. Ctrl + N (Search Files)：本来Ctrl+N是搜索Java类的，但因为我是做前端开发的不需要搜索Java类文件，所以我就把它和Ctrl + Shift + E对调了，这样操作起来更快嘛~
18. Ctrl + E / Ctrl + Shift + E (Recent Files / Recently Changed Files)：快速打开最近打开过或编辑过的文件。
19. Ctrl + Shift + F：搜索，搜索，搜索！这个人人都知道，可以使用正则表达式搜索，或直接全文搜索，也可以限定搜索的范围是某个模块、某个文件夹、当前文件或者整个项目等等，还可以限定搜索文件的类型，总之不要用得太多哦~而且如果你在左侧的导航栏中选中某个文件夹再按Ctrl + Shift + F话，它会自动识别你是要搜索选中的文件夹下面的文件，非常地聪明！不过IntelliJ的搜索在某些细节方面做得不如Eclipse好，这里我就不展开了。
20. Ctrl + G (Go to Line)：输入行号跳到指定行。
21. Ctrl + Q / Ctrl + Shift + Q (Last Edit Location / Next Edit Location)：最近一次编辑的位置，连续按的话还可以跳到上次，上上次，上上上次……编辑的位置，开发必备快捷键。
22. Shift + Enter / Ctrl + Shift + Enter (Start New Line / Start New Line Before Current)：我希望这两个快捷键你已经足够熟悉了:)
23. Alt + V / Alt + H (Split Vertically / Split Horizontally)：开发过程中我们常常需要同时修改或者对比两个或者更多的文件，这个时候如果来回切换文件是非常麻烦的，那么我们就可以使用这两个快捷键来做分屏浏览，同时查看或者修改多个文件了。原来在Eclipse中，可以直接拖动文件做分屏，感觉要比在IntelliJ中方便一点点……
24. Ctrl + K / Ctrl + Shift + K / Ctrl + T (Check In Project / Push / Update Project)：Git常用操作，提交到本地 / 提交到远程服务器 / 更新代码。
25. Ctrl + D / F7 / Shift + F7 (Compare Files / Next Difference / Previous Difference)：Ctrl+D在文本编辑时是删除当前行，但是在其他地方，比如说版本操作的时候就是文本对比，在提交代码时配合F2/F3/F7/Shift+F7会让你提交代码前的检查操作变得非常地顺畅！另外，你随便选中两个文件夹或者两个文件，也可以用Ctrl + D做文件对比哦~
26. Ctrl + Shift + M (Move Caret to Matching Brace)：让光标在开闭括号（大中小括号皆可使用）之间来回跳转，非常非常有用！
27. Alt + L / Ctrl + L / Ctrl + Shift + L (Find Word At Caret / Find Next /Find Previous)：这三个快捷键需要配合在一起使用。原因是它们都有缺陷，Alt + L可以搜索当前光标高亮处的关键词，但是它只能向下搜索，并没有配套的向上搜索的快捷键，而Ctrl + L / Ctrl + Shift + L可以上下搜索，但是不配合Alt + L直接使用时，它只会搜索你上一次搜索过的关键词，而不是搜索当前光标高亮处的关键词。所以这三个快捷键的正确使用方式是：先高亮选中你想要查找的文本，然后按一次Alt + L，接下来就一直使用Ctrl + L和Ctrl + Shift + L上下查找关键词。这也是IntelliJ做得不如Eclipse的地方，原先Eclipse的Ctrl + K / Ctrl + Shif + K就相当于这三个快捷键的组合，我也是摸索一番之后才发现可以用这三个快捷键来取代前面Eclipse的快捷键的。

***

#### 四星推荐
1. Alt + Enter (Show Intention Actions)：这个快捷键本身是很强大的，只是会有一点学习成本，它会给你一些有用的提示，不过前提是你需要先学习它能够给你哪些提示，这些提示都在Settings > Intentions的列表中。
2. Ctrl + J (Insert Live Template)：插入一些预定义的模板，IDE常备功能，你可以自定义自己的模板，这些模板都在Settings > Editor > Live Templates中。
3. Alt + Home (Jump to Navigation Bar)：快速切换文件或文件夹。
4. Alt + R (Rerun)：因为我在开发过程中会需用重启服务器，Jetty或者Tomcat什么的，所以我就把这个简单的快捷键组合设置成了重启服务器的操作指令。
5. Ctrl + P (Parameter Info)：查看函数的形参列表，对JavaScript和Java都有用哦~
6. Ctrl + Shift + A (Find Action)：当你记不住操作的快捷键，或者该操作没有设置快捷键的时候，你就可以用这个快捷键来搜索。
7. Alt + F2 (Web Preview)：直接用浏览器打开当前文件，通常是HTML文件，前端开发常用。
8. Alt + ` (VSC Operations Popup)：Git（严格来说应该是VCS）常用操作菜单。

***

#### 三星推荐
1. Alt + Button1 (Add or Remove Caret)：可以同时添加多个光标进行修改，偶尔会用到。
2. Ctrl + Alt + T (Surround With)：选中一段文本，然后按这个快捷键，偶尔也会用得上，这个大家自己试试吧。
3. Shift + Escape / Ctrl + Shift + F12 / Ctrl + Shift + Arrows (Hide Active Tool Window / Hide All Tool Windows / Resize Active Tool Window)：隐藏当前激活的工具窗口 / 隐藏所有的工具窗口 / 修改工具窗口宽高度，在你只需要看代码部分的时就，可以把其他的占空间的东东隐藏起来。
4. Ctrl + F12 (File Structure)：这个可能在Java开发中常用，反正我感觉我做前端开发用的不多。
5. Double Shift (Search Everywhere)：如果实在是不知道该怎么搜的可以试试这个。

***

#### 结束语
IntelliJ确实非常的智能，比如你在所有文本编辑的地方都可以使用文本编辑相关的快捷键（例如在搜索框中使用Alt + W快捷键），这个在Eclipse里面是做不到的，再比如你在很多地方都可以直接输入搜索关键字做搜索过滤，多多尝试一定会给你带来很多的惊喜！如果后面我再发现有好用的快捷键或者快捷使用方法我也会继续补充，也欢迎大家以留言的方式进行补充，如果这篇文章对你有所帮助的话，也请留言告诉我，让我分享你的快乐，谢谢大家！
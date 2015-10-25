*原文链接：http://www.learncpp.com/cpp-tutorial/42-global-variables/*

在上一节中，你已经了解了在块内被定义的变量称为局部变量。局部变量具有块级作用域（它们只能在它们所被定义的块内可见），和具有自动的生命周期（它们在块开始执行的时候被创建，在块退出的时候被销毁）。

不在块内被定义的变量称为全局变量。全局变量具有**静态的生命周期**，程序开始的时候它们就会被创建，程序结束的时候被销毁。全局变量有着**全局作用域**（也被称为“全局命名空间作用域”或者“文件作用域”），意思是在声明它们的文件结束之前它们都是可见的。

### 定义全局变量

约定俗成地，全局变量在文件的顶部声明，在include的之下，在所有代码之上。下面例子里面定义了几个全局变量：

    #include <iostream>
     
    // Variables declared outside of a block are global variables
    int g_x; // global variable g_x
    const int g_y(2); // global variable g_y
     
    int doSomething()
    {
        // global variables can be seen and used everywhere in program
        g_x = 3;
        std::cout << g_y << "\n";
    }
     
    int main()
    {
        // global variables can be seen everywhere in program
        g_x = 5;
        std::cout << g_y << "\n";
     
        return 0;
    }

和嵌套块的变量屏蔽外层块同名变量的机制一样，局部变量如果和全局变量同名，也导致在局部变量声明的块内将全局变量屏蔽。但是可以通过全局变量操作符（::）告诉编译器你需要的变量是全局而不是局部的。

    #include <iostream>
    int value(5); // global variable
     
    int main()
    {
        int value = 7; // hides the global variable value
        value++; // increments local value, not global value
        ::value--; // decrements global value, not local value
     
        std::cout << "global value: " << ::value << "\n";
        std::cout << "local value: " << value << "\n";
        return 0;
    } // local value is destroyed

代码会输出：

    global value: 4
    local value: 8

局部变量和全局变量同名会带了很多不必要的麻烦，所以应该尽量避免这种情况出现。很多开发者约定俗成地给全局变量加上`g_`的前缀来表明该变量是全局变量。这样也可以很好的避免局部变量和全局变量的命名冲突问题。

### 使用`static`和`extern`关键字来进行内部和外部链接

除了作用域和生命周期，变量还具有第三个属性：链接（linkage）。一个变量的链接决定了它们是否能够被其他文件所引用。

一个具有内部链接的（internal linkage）的变量称为内部变量（或者静态变量），它只能在它被定义的文件内可见。一个具有外部链接（external linkage）的变量称为外部变量，它不仅仅可以在它被定义的文件中使用，其它文件也同样可以使用它。

如果我们想让一个全局变量变成一个内部变量（这个变量只能在本文件中使用），我们可以使用`static`关键字修饰它：

    static int g_x; // g_x是静态的，只能在本文件中被使用
     
    int main()
    {
        return 0;
    }

类似地，如果我们想让一个全局变量变成一个外部变量（可以在程序的任何地方被使用），我们可以用`extern`关键字修饰它：

    extern double g_y(9.8); // g_y is external, and can be used by other files
     
    int main()
    {
        return 0;
    }

在块以外被定义的可变的变量（不带const关键字）都默认是外部变量。然而常量（带const关键字的）通常默认为内部变量。

### 使用`extern`关键字进行变量前置声明（Variable forward declarations）

在多文件进行编程的章节中，你已经了解到了如果我们需要使用另外一个文件的函数，我们必须要进行函数的前置声明。

类似地，为了使用另外一个文件已经声明的外部全局变量，你必须要使用变量前置声明。对于变量来说，前置声明也是同样使用`extern`来进行。

这里也有一个变量前置声明的例子：


global.cpp:

    // 定义了两个全局变量
    int g_x;
    int g_y(2);
    // 这里之后，两个变量可以在本文件内使用

main.cpp:

    extern int g_x; // g_x变量的前置声明 -- g_x可以在这里之后被这个文件所使用
     
    int main()
    {
        extern int g_y; // g_y变量的前置声明 -- g_y可以在这里之后被这个main所使用
     
        g_x = 5;
        std::cout << g_y; // 打印出：2
     
        return 0;
    }

如果变量在块以外被前置声明，那么它就可以在整个文件中被使用。如果前置声明是在一个块内，它只能在该块内被使用。

如果一个变量声明的时候是静态的（static），那么尝试前置声明该变量不会成功：

constants.cpp:

    static const double g_gravity(9.8);

main.cpp:

    #include <iostream>
     
    extern const double g_gravity; // 因为g_gravity是内部链接的，所以该前置声明无法找到在constants.cpp定义的g_gravity
     
    int main()
    {
        std:: cout << g_gravity; // 编译出错，main.cpp中没有找到g_gravity这个变量的定义
        return 0;
    }

注意如果打算定义一个未被初始化的全局变量，不要使用`extern`关键字，否则编译器会认为你尝试去前置声明一个变量。

### 顺带说一下函数链接

函数和变量一样有着链接的属性。函数通常默认是外部链接，但是可以通过关键字`static`把它设置为内部链接：

    // 这个函数被声明为static，只能在这个函数内使用
    // 尝试引用这个函数都会失败
    static int add(int x, int y)
    {
        return x + y;
    }

函数前置声明不需要`extern`关键字。因为C++可以通过有没有函数体来判断当前是在定义一个函数还是只是声明函数原型。

但是变量就会更复杂一点，因为它们定义的时候可以被初始化也可以不初始化，所以这就是为什么它们需要显式地使用`extern`关键字进行声明。

### 全局符号常量

在之前的章节中，我们讨论过符号常量的概念，类似这样定义它们：

    #ifndef CONSTANTS_H
    #define CONSTANTS_H
     
    // 定义符号常量的命名空间
    namespace Constants
    {
        const double pi(3.14159);
        const double avogadro(6.0221413e23);
        const double my_gravity(9.2); // m/s^2 -- 这个星球上的重力比较小嘛
        // ... 其它常量
    }
    #endif

每次`#include "constants.h"` 的时候，这些变量都会复制到代码文件里面，对于比较小的程序这样做没什么问题。但是如果constants.h被include了20次，每个变量都会重复20次。在这个程序中常量不是很多，但是如果常量很多的话，或者还有占用内存较大的变量的话，那么这样就会导致程序非常臃肿。

我们把这些常量变成全局常量来避免这个问题，让头文件只用来做变量的前置声明：

constants.cpp:
    
    namespace Constants
    {
        // 真正的全局常量
        extern const double pi(3.14159);
        extern const double avogadro(6.0221413e23);
        extern const double my_gravity(9.2); 
    }

constants.h:

    #ifndef CONSTANTS_H
    #define CONSTANTS_H
     
    namespace Constants
    {
        // 只做前置声明
        extern const double pi;
        extern const double avogadro;
        extern const double my_gravity;
    }
     
    #endif

用法不变：

    #include "constants.h"
    double circumference = 2 * radius * Constants::pi;

现在符号常量只有一次实例化（在constants.cpp），而不是每次constants.h被include的时候都需要实例化，而所有代码文件使用这些常量的时候用的都是在constant.cpp里面实例化的。

因为全局符号常量应该放在命名空间里面而且是只读的，所以不需要`g_`前缀了。

### 再唠叨一句关于全局变量的话

新手通常尝试去用很多全局变量，因为它们用起来比较爽，尤其是很多代码有很多函数的时候。然而，应该尽量避免使用全局变量！我们会在下一个节讨论这个问题。


### 总结

全局变量有着全局的作用域，所以它们可以在程序的任何一个地方被使用。就像函数一样，你必须要通过前置声明（使用关键字`extern`）来使用在其它文件里面定义的全局变量。

默认情况下，不带const关键字的变量都有着外部链接；带const的变量（常量）都有着内部的链接，你必须要通过使用`extern`关键字显式地使它们变成外部链接。

使用`g_`前缀来表明这个变量是一个全局变量。

下面有一个关于常量和变量对于`extern`用法的代码总结：

    // 未初始化定义
    int g_x;       // 定义未被初始化的全局变量
    const int g_x; // 不允许，常量必须要初始化
     
    // 使用`extern`进行前置声明
    extern int g_z;       
    extern const int g_z; 
     
    // 已初始化的定义
    int g_y(1);       
    const int g_y(1);
     
    // 使用extern进行初始化定义
    extern int g_w(1);       // 这里extern语句是多余的，因为全局变量默认是extern的
    extern const int g_w(1); // 定义了全局常量


小测验：

1) 作用域、生命周期和链接的区别是什么？全局变量具有怎么样的作用域、声明周期和链接？

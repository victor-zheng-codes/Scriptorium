
import { PrismaClient } from '@prisma/client';
import * as fs from "fs";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  try{
    const seededUsers = JSON.parse(fs.readFileSync('prisma/dummy-users.json', 'utf-8'));

    const existsUsers = await prisma.user.count()

    if (existsUsers > 0){
      console.log("Database already has users. Not seeding.")
      return
    }

    for (const user of seededUsers) {
          await prisma.user.create({
              data: {
                  email: user.email,
                  username: user.username,
                  password: await bcrypt.hash(user.password, 10),
                  firstName: user.firstName,
                  lastName: user.lastName,
                  avatar: user.avatar, 
                  phoneNumber: user.phoneNumber,
                  isAdmin: user.isAdmin,
                  refreshToken: user.refreshToken,
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt
                },
              },
          );
    }

// Populate tags
await prisma.tag.createMany({
  data: [
    { tagName: 'Computer Science' }, // 1
    { tagName: 'Programming Basics' }, // 2
    { tagName: 'Python' }, // 3
    { tagName: 'JavaScript' }, // 4
    { tagName: 'Java' }, // 5
    { tagName: 'C#' }, // 6
    { tagName: 'Ruby' }, // 7
    { tagName: 'Lua' }, // 8
    { tagName: 'C++' }, // 9
    { tagName: 'PHP' }, // 10
    { tagName: 'Kotlin' }, // 11
    { tagName: 'Swift' }, // 12
    { tagName: 'R' }, // 13
    { tagName: 'Arrays' }, // 14
    { tagName: 'Functions' }, // 15
    { tagName: 'Loops' }, // 16
    { tagName: 'Console Output' }, // 17
    { tagName: 'Hello World' }, // 18
    { tagName: 'Data Visualization' }, // 19
    { tagName: 'Classes and Objects' }, // 20
    { tagName: 'Artificial Intelligence' },
    { tagName: 'Machine Learning' },
    { tagName: 'Blockchain' },
    { tagName: 'Web Development' },
    { tagName: 'Cloud' },
    { tagName: 'React' },
    { tagName: 'Node' },
    { tagName: 'SQL' },
    { tagName: 'VR/AR' },
    { tagName: 'Math' },
    { tagName: 'Physics' },
    { tagName: 'Haskell' },
    { tagName: 'DP' },
    { tagName: 'Search' },
    { tagName: 'Print' },
    { tagName: 'Debug' },
    { tagName: 'Amazon' },
    { tagName: 'Google' },
    { tagName: 'Microsoft' },
    { tagName: 'Security' },
    { tagName: 'Cyber' },
    { tagName: 'Documentation' },
    { tagName: 'DevOps' },
    { tagName: 'CI/CD' },
    { tagName: 'Product' },
    { tagName: 'Infrastructure' },
    { tagName: 'Docker' },
    { tagName: 'AWS' },
    { tagName: 'Azure' },
    { tagName: 'GCP' },
    { tagName: 'Kubernetes' },
    { tagName: 'Windows' },
    { tagName: 'Mac' },
    { tagName: 'Android' },
    { tagName: 'Apple' },
    { tagName: 'IOS' },
    { tagName: 'Digital Ocean' },
      ],
    });

    // Create dummy templates
    await prisma.template.createMany({
      data: [
        // Python
        { 
          userId: 1, 
          title: 'Python3 Hello World', 
          description: "Hello World Example", 
          content: 'print("Hello, World!")', 
          language: "python" 
        },
        { 
          userId: 1, 
          title: 'Python3 Arithmetic', 
          description: "Simple addition in Python", 
          content: 'a = 10\nb = 20\nprint(a + b)', 
          language: "python" 
        },

        // JavaScript
        { 
          userId: 2, 
          title: 'JavaScript Hello World', 
          description: "Hello World in JavaScript", 
          content: 'console.log("Hello, World!");', 
          language: "javascript" 
        },
        { 
          userId: 2, 
          title: 'JavaScript Sum Function', 
          description: "A simple sum function", 
          content: 'function sum(a, b) {\n  return a + b;\n}\nconsole.log(sum(3, 5));', 
          language: "javascript" 
        },

        // Java
        { 
          userId: 3, 
          title: 'Java Hello World', 
          description: "Hello World in Java", 
          content: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}', 
          language: "java" 
        },
        { 
          userId: 3, 
          title: 'Java Loop Example', 
          description: "A simple for-loop in Java", 
          content: 'for (int i = 0; i < 5; i++) {\n  System.out.println("Iteration " + i);\n}', 
          language: "java" 
        },

        // Ruby
        { 
          userId: 5, 
          title: 'Ruby Hello World', 
          description: "Hello World in Ruby", 
          content: 'puts "Hello, World!"', 
          language: "ruby" 
        },
        { 
          userId: 5, 
          title: 'Ruby Block Example', 
          description: "A simple block in Ruby", 
          content: '[1, 2, 3].each { |x| puts x }', 
          language: "ruby" 
        },

        // Lua
        { 
          userId: 6, 
          title: 'Lua Hello World', 
          description: "Hello World in Lua", 
          content: 'print("Hello, World!")', 
          language: "lua" 
        },
        { 
          userId: 6, 
          title: 'Lua Function Example', 
          description: "A function example in Lua", 
          content: 'function add(a, b)\n    return a + b\nend\n\nprint(add(2, 3))', 
          language: "lua" 
        },

        // C++
        { 
          userId: 7, 
          title: 'C++ Hello World', 
          description: "Hello World in C++", 
          content: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}', 
          language: "cpp" 
        },
        { 
          userId: 8, 
          title: 'C++ Conditional Example', 
          description: "An if-statement in C++", 
          content: '#include <iostream>\n\nint main() {\n    int a = 10;\n    if (a > 5) {\n        std::cout << "a is greater than 5" << std::endl;\n    }\n    return 0;\n}', 
          language: "cpp" 
        },

        // PHP
        { 
          userId: 8, 
          title: 'PHP Hello World', 
          description: "Hello World in PHP", 
          content: '<?php\n  echo "Hello, World!";\n?>', 
          language: "php" 
        },
        { 
          userId: 8, 
          title: 'PHP Array Example', 
          description: "An array example in PHP", 
          content: '<?php\n  $arr = [1, 2, 3];\n  foreach ($arr as $value) {\n    echo $value . "\\n";\n  }\n?>', 
          language: "php" 
        },
        { 
          userId: 3, 
          title: 'C Hello World', 
          description: "Hello World Example in C", 
          content: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}', 
          language: "c" 
        },
        { 
          userId: 3, 
          title: 'C Arithmetic', 
          description: "Simple addition in C", 
          content: '#include <stdio.h>\n\nint main() {\n    int a = 10;\n    int b = 20;\n    printf("Sum: %d\\n", a + b);\n    return 0;\n}', 
          language: "c" 
        },
        { 
          userId: 4, 
          title: 'C Factorial', 
          description: "Calculate the factorial of a number", 
          content: '#include <stdio.h>\n\nint factorial(int n) {\n    if (n == 0) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    int num = 5;\n    printf("Factorial of %d: %d\\n", num, factorial(num));\n    return 0;\n}', 
          language: "c" 
        },
        { 
          userId: 4, 
          title: 'C String Length', 
          description: "Calculate the length of a string", 
          content: '#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char str[] = "Hello, World!";\n    printf("Length of string: %lu\\n", strlen(str));\n    return 0;\n}', 
          language: "c" 
        },
        { 
          userId: 6, 
          title: 'Rust Hello World', 
          description: "Hello World Example in Rust", 
          content: 'fn main() {\n    println!("Hello, World!");\n}', 
          language: "rust" 
        },
        { 
          userId: 6, 
          title: 'Rust Factorial', 
          description: "Calculate the factorial of a number in Rust", 
          content: 'fn factorial(n: u32) -> u32 {\n    if n == 0 { return 1; }\n    n * factorial(n - 1)\n}\n\nfn main() {\n    let num = 5;\n    println!("Factorial of {}: {}", num, factorial(num));\n}', 
          language: "rust" 
        },
        { 
          userId: 7, 
          title: 'Perl Hello World', 
          description: "Hello World Example in Perl", 
          content: 'print "Hello, World!\\n";', 
          language: "perl" 
        },
        { 
          userId: 7, 
          title: 'Perl Sum of Two Numbers', 
          description: "Add two numbers in Perl", 
          content: 'my $a = 10;\nmy $b = 20;\nprint "Sum: ", $a + $b, "\\n";', 
          language: "perl" 
        },
        // additional examples of python, java, javascript
        { 
          userId: 1, 
          title: 'Python3 String Reversal', 
          description: "Reverse a string in Python", 
          content: 's = "Hello, World!"\nprint(s[::-1])', 
          language: "python" 
        },
        { 
          userId: 1, 
          title: 'Python3 List Comprehension', 
          description: "Use a list comprehension to generate squares", 
          content: 'squares = [x**2 for x in range(10)]\nprint(squares)', 
          language: "python" 
        },
        { 
          userId: 2, 
          title: 'JavaScript String Length', 
          description: "Find the length of a string in JavaScript", 
          content: 'let str = "Hello, World!";\nconsole.log("Length:", str.length);', 
          language: "javascript" 
        },
        { 
          userId: 2, 
          title: 'JavaScript Array Mapping', 
          description: "Map an array to its square values", 
          content: 'let numbers = [1, 2, 3, 4];\nlet squares = numbers.map(num => num ** 2);\nconsole.log(squares);', 
          language: "javascript" 
        },
        { 
          userId: 3, 
          title: 'Java Array Printing', 
          description: "Print an array of integers in Java", 
          content: 'public class Main {\n  public static void main(String[] args) {\n    int[] nums = {1, 2, 3, 4};\n    for (int num : nums) {\n      System.out.println(num);\n    }\n  }\n}', 
          language: "java" 
        },
        { 
          userId: 3, 
          title: 'Java Factorial Calculation', 
          description: "Compute factorial using recursion in Java", 
          content: 'public class Main {\n  public static int factorial(int n) {\n    if (n == 0) return 1;\n    return n * factorial(n - 1);\n  }\n\n  public static void main(String[] args) {\n    System.out.println("Factorial of 5: " + factorial(5));\n  }\n}', 
          language: "java" 
        },

        // C++
        { 
          userId: 1, 
          title: 'C++ Hello CSC309', 
          description: "Hello World in C++", 
          content: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, CSC309!" << std::endl;\n    return 0;\n}', 
          language: "cpp" 
        },
        { 
          userId: 2, 
          title: 'C++ Addition Function', 
          description: "A function example to add two numbers in C++", 
          content: '#include <iostream>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    std::cout << add(2, 3) << std::endl;\n    return 0;\n}', 
          language: "cpp" 
        },
        { 
          userId: 3, 
          title: 'C++ Array Example', 
          description: "A simple array example in C++", 
          content: '#include <iostream>\n\nint main() {\n    int arr[3] = {1, 2, 3};\n    for (int i = 0; i < 3; i++) {\n        std::cout << arr[i] << " ";\n    }\n    std::cout << std::endl;\n    return 0;\n}', 
          language: "cpp" 
        },
        { 
          userId: 4, 
          title: 'C++ Factorial Example', 
          description: "Calculate the factorial of a number in C++", 
          content: '#include <iostream>\n\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    int num = 5;\n    std::cout << "Factorial of " << num << " is " << factorial(num) << std::endl;\n    return 0;\n}', 
          language: "cpp" 
        },

        // More languages (adjust IDs and add two examples for each as needed)
      ],
    });

    // Create dummy template tags
    await prisma.templateTags.createMany({
      data: [
        // Python Templates
        { tagId: 3, templateId: 1 }, // Python
        { tagId: 18, templateId: 1 }, // Hello World
        { tagId: 14, templateId: 2 }, // Arrays
        { tagId: 17, templateId: 2 }, // Console Output

        // JavaScript Templates
        { tagId: 4, templateId: 3 }, // JavaScript
        { tagId: 18, templateId: 3 }, // Hello World
        { tagId: 15, templateId: 4 }, // Functions
        { tagId: 17, templateId: 4 }, // Console Output

        // Java Templates
        { tagId: 5, templateId: 5 }, // Java
        { tagId: 18, templateId: 5 }, // Hello World
        { tagId: 16, templateId: 6 }, // Loops
        { tagId: 17, templateId: 6 }, // Console Output

        // Ruby Templates
        { tagId: 7, templateId: 9 }, // Ruby
        { tagId: 18, templateId: 9 }, // Hello World
        { tagId: 16, templateId: 10 }, // Loops
        { tagId: 17, templateId: 10 }, // Console Output

        // Lua Templates
        { tagId: 8, templateId: 11 }, // Lua
        { tagId: 18, templateId: 11 }, // Hello World
        { tagId: 15, templateId: 12 }, // Functions
        { tagId: 17, templateId: 12 }, // Console Output

        // C++ Templates
        { tagId: 9, templateId: 13 }, // C++
        { tagId: 18, templateId: 13 }, // Hello World
        { tagId: 16, templateId: 14 }, // Loops
        { tagId: 17, templateId: 14 }, // Console Output

        // PHP Templates
        { tagId: 10, templateId: 15 }, // PHP
        { tagId: 18, templateId: 15 }, // Hello World
        { tagId: 14, templateId: 16 }, // Arrays
        { tagId: 16, templateId: 16 }, // Loops

        // R Templates
        { tagId: 13, templateId: 21 }, // R
        { tagId: 18, templateId: 21 }, // Hello World
        { tagId: 19, templateId: 22 }, // Data Visualization
        { tagId: 17, templateId: 22 }, // Console Output
      ],
    });

    await prisma.blog.createMany({
      data: [
          {
            // "blogId": 1,
            "title": "Understanding JavaScript",
            "content": "JavaScript is a versatile, high-level programming language primarily used for web development. Initially created to make static web pages interactive, JavaScript now powers complex web applications, backend servers, mobile apps, and even machine learning models. Key features include dynamic typing, event-driven programming, and a large ecosystem of libraries and frameworks such as React, Angular, and Vue.js. Mastering JavaScript opens doors to full-stack development, with opportunities to work on diverse projects across industries.",
            "description": "An overview of JavaScript fundamentals and use cases.",
            "isDeleted": false,
            "isAppropriate": true,
            "authorId": 1,
            "upvotes": 2,
            "downvotes": 0
          },
          {
            // "blogId": 2,
            "title": "Getting Started with Python",
            "content": "Python is one of the most popular programming languages due to its simplicity and versatility. Known for its readable syntax, Python is used in fields ranging from web development to artificial intelligence and data science. Its extensive libraries, such as NumPy, pandas, and TensorFlow, make it a go-to choice for scientific computation and machine learning. Python’s motto, \"There’s only one way to do it,\" encourages writing clear and efficient code. Beginners and experts alike value Python's ability to turn ideas into working solutions quickly.",
            "description": "A beginner-friendly guide to Python programming.",
            "isDeleted": false,
            "isAppropriate": true,
            "authorId": 2,
            "upvotes": 0,
            "downvotes": 1
          },
          {
            // "blogId": 3,
            "title": "Mastering Java Basics",
            "content": "Java, a cornerstone of modern programming, is an object-oriented language widely used in enterprise applications, Android development, and backend systems. Its platform independence is achieved through the Java Virtual Machine (JVM), allowing developers to \"write once, run anywhere.\" Essential concepts include classes, interfaces, and exception handling. The language's robustness and extensive ecosystem make it ideal for large-scale, high-performance applications in banking, retail, and beyond.",
            "description": "Introduction to Java basics and its key features.",
            "isDeleted": false,
            "isAppropriate": true,
            "authorId": 3,
            "upvotes": 1,
            "downvotes": 1
          },
          {
            // "blogId": 4,
            "title": "Why Lua is the Future of Development",
            "content": "Lua, is a statically typed, compiled language designed by Google engineers. It emphasizes simplicity and performance, making it a top choice for scalable backend systems, cloud infrastructure, and microservices. Features like built-in concurrency support through goroutines and a fast compilation process enable developers to build efficient, modern applications. Go’s straightforward syntax and minimal dependencies make it a language of choice for companies like Uber, Docker, and Kubernetes.",
            "description": "Explore why developers are adopting Lua for modern applications.",
            "isDeleted": false,
            "isAppropriate": true,
            "authorId": 4,
            "upvotes": 1,
            "downvotes": 0
          },
          {
            // "blogId": 5,
            "title": "C# for Beginners",
            "content": "C# is a powerful, object-oriented language developed by Microsoft as part of its .NET framework. It combines the flexibility of C++ with the simplicity of Visual Basic, making it ideal for desktop applications, web services, and game development using Unity. Key features include garbage collection, asynchronous programming, and LINQ for querying data. Its strong type system and comprehensive standard library enable developers to build robust, scalable solutions.",
            "description": "A comprehensive guide to learning C# for beginners.",
            "isDeleted": false,
            "isAppropriate": true,
            "authorId": 5,
            "upvotes": 0,
            "downvotes": 1
          },
          {
            // "blogId": 6,
            "title": "Ruby on Rails: A Beginner’s Guide",
            "content": "Ruby is a dynamic, high-level programming language known for its focus on simplicity and productivity. When paired with Rails, a powerful web development framework, it enables developers to build web applications quickly and efficiently. Ruby on Rails popularized conventions like MVC architecture and the \"Don't Repeat Yourself\" principle. Its elegant syntax and extensive library of gems make it a favorite for startups and rapid prototyping.",
            "description": "An introductory guide to Ruby and the Rails framework.",
            "isDeleted": false,
            "isAppropriate": true,
            "authorId": 6,
            "upvotes": 1,
            "downvotes": 0
          },
          {
            // "blogId": 7,
            "title": "Diving Into C++",
            "content": "C++ is a high-performance programming language that builds upon the foundations of C, adding object-oriented features and greater abstraction. Known for its speed and control over system resources, C++ is widely used in gaming, systems programming, and embedded systems. Its extensive standard library and support for templates allow developers to create efficient, reusable code. Despite its complexity, mastering C++ opens doors to highly technical fields.",
            "description": "An overview of C++ programming for beginners.",
            "isDeleted": false,
            "isAppropriate": true,
            "authorId": 7,
            "upvotes": 0,
            "downvotes": 1
          },
          {
            // "blogId": 8,
            "title": "PHP and Modern Web Development",
            "content": "PHP, a server-side scripting language, has been a cornerstone of web development for decades. Known for its integration with HTML and databases like MySQL, PHP powers over 70% of websites, including WordPress and Facebook. Its modern features, such as improved performance in PHP 8 and built-in error handling, keep it relevant in the ever-evolving web development landscape.",
            "description": "Understand PHP basics and its role in web development.",
            "isDeleted": false,
            "isAppropriate": true,
            "authorId": 8,
            "upvotes": 1,
            "downvotes": 0
          },
          {
            // "blogId": 9,
            "title": "Learning Swift for iOS Development",
            "content": "Swift, a programming language developed by Apple, is used for building iOS, macOS, watchOS, and tvOS applications. With an emphasis on safety, performance, and expressiveness, Swift allows developers to write clean and powerful code. It’s designed to work with Objective-C but also simplifies many of the complexities of C-based languages. Swift’s powerful features, like optional types, closures, and generics, make it a modern choice for mobile development.",
            "description": "Introduction to Swift and iOS development basics.",
            "isDeleted": false,
            "isAppropriate": true,
            "authorId": 9,
            "upvotes": 0,
            "downvotes": 1
          },    
          { 
            title: 'Exploring Kotlin for Android', 
            content: `
              Kotlin is a statically typed programming language that runs on the Java Virtual Machine (JVM). 
              Officially supported by Google for Android development, Kotlin simplifies many of Java’s verbose syntax 
              and reduces boilerplate code. It includes modern features such as null safety, extension functions, 
              and data classes, making it a great choice for Android developers who want to write cleaner and more efficient code.`
            ,
            description: 'An introduction to Kotlin for Android application development.', 
            isDeleted: false, 
            isAppropriate: true, 
            authorId: 10 
          },    
        { 
          title: 'Understanding Machine Learning', 
          content: `
            Machine Learning (ML) is a subset of artificial intelligence (AI) that allows systems to learn 
            and improve from experience without being explicitly programmed. ML algorithms use data to identify 
            patterns and make predictions. The core components of machine learning are supervised learning, 
            unsupervised learning, and reinforcement learning. By leveraging large datasets and powerful computational 
            models, ML has revolutionized industries such as healthcare, finance, and e-commerce.
          `,
          description: 'A beginner’s guide to machine learning and its applications.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 1 
        },
        { 
          title: 'Introduction to Data Science', 
          content: `
            Data Science is the practice of extracting meaningful insights and patterns from large datasets. 
            It combines principles from statistics, computer science, and domain-specific knowledge. 
            Key tasks in data science include data cleaning, analysis, and visualization. Tools such as Python, R, 
            and SQL are widely used for data manipulation and analysis. The field of data science is at the forefront 
            of technological innovation, powering businesses to make data-driven decisions.
          `,
          description: 'Understanding the role and importance of data science.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 2 
        },
        { 
          title: 'The Basics of Artificial Intelligence', 
          content: `
            Artificial Intelligence (AI) refers to the simulation of human intelligence in machines 
            that are programmed to think and learn. The goal of AI is to create machines that can perform tasks 
            such as problem-solving, language understanding, and vision recognition. Common techniques in AI 
            include neural networks, decision trees, and natural language processing. AI is transforming industries 
            from autonomous vehicles to healthcare diagnostics.
          `,
          description: 'An introduction to the key concepts in artificial intelligence.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 3 
        },
        { 
          title: 'Understanding Cybersecurity', 
          content: `
            Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. 
            With the increasing amount of data being stored and shared online, securing digital information 
            has become more critical than ever. Common cybersecurity techniques include encryption, firewalls, 
            and multi-factor authentication. Ethical hacking, penetration testing, and incident response play 
            a significant role in defending against cyber threats and ensuring data integrity.
          `,
          description: 'A primer on the importance of cybersecurity in the digital world.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 4 
        },
        { 
          title: 'Blockchain Technology Explained', 
          content: `
            Blockchain is a decentralized ledger technology that records transactions across multiple computers 
            in such a way that the registered transactions cannot be altered retroactively. Initially popularized by 
            cryptocurrencies like Bitcoin, blockchain is now being applied in various industries, including supply chain, 
            finance, and healthcare. The main features of blockchain technology include decentralization, immutability, 
            and transparency, making it an ideal solution for secure and transparent data management.
          `,
          description: 'Understanding how blockchain works and its applications beyond cryptocurrency.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 5 
        },
        { 
          title: 'Building Your First Web Application', 
          content: `
            Building a web application involves both frontend and backend development. The frontend consists 
            of everything that users interact with, typically built using HTML, CSS, and JavaScript. 
            The backend handles data processing, storage, and communication with external services. 
            Modern web development often involves frameworks like React, Angular, or Vue.js on the frontend, 
            and Node.js, Django, or Ruby on Rails for the backend. With the rise of cloud platforms, deploying 
            a web application has become easier, allowing developers to focus on building features rather than infrastructure.
          `,
          description: 'A step-by-step guide to creating your first web application.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 6 
        },
        { 
          title: 'Cloud Computing for Beginners', 
          content: `
            Cloud computing refers to the delivery of computing services such as servers, storage, and databases 
            over the internet. Rather than owning physical hardware, businesses and individuals can rent resources from 
            cloud providers like AWS, Microsoft Azure, and Google Cloud. Cloud computing offers scalability, 
            cost-effectiveness, and flexibility, allowing companies to scale up or down based on demand. 
            The main models of cloud computing include Infrastructure-as-a-Service (IaaS), Platform-as-a-Service (PaaS), 
            and Software-as-a-Service (SaaS).
          `,
          description: 'Understanding cloud computing and its service models.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 7 
        },
        { 
          title: 'Introduction to React.js', 
          content: `
            React.js is a popular JavaScript library used for building user interfaces. Developed by Facebook, 
            React enables developers to build reusable components that make the process of developing complex UIs 
            much easier. React’s virtual DOM improves performance by minimizing direct manipulation of the actual DOM. 
            React can be used with other libraries like Redux for state management and React Router for navigation. 
            Its component-based architecture makes it a powerful tool for both small and large applications.
          `,
          description: 'A guide to getting started with React.js for building modern UIs.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 8 
        },
        { 
          title: 'Exploring Node.js', 
          content: `
            Node.js is a JavaScript runtime built on Chrome’s V8 JavaScript engine. It enables developers to 
            write server-side code using JavaScript, making it possible to build scalable, high-performance 
            applications. Node.js is widely used for real-time applications, REST APIs, and microservices. 
            Its non-blocking, event-driven architecture makes it ideal for applications that require handling 
            numerous simultaneous connections with minimal delay. With a rich ecosystem of libraries available 
            through npm (Node Package Manager), Node.js accelerates the development process.
          `,
          description: 'Learn the basics of Node.js and its role in server-side development.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 9 
        },
        { 
          title: 'Learning SQL for Databases', 
          content: `
            SQL (Structured Query Language) is the standard language used to manage and manipulate relational 
            databases. SQL is used for tasks such as querying data, updating records, inserting new records, 
            and deleting unwanted records. Key SQL operations include SELECT, INSERT, UPDATE, DELETE, and JOIN. 
            Mastering SQL enables developers to efficiently work with databases and ensures data integrity and consistency.
            Popular database management systems such as MySQL, PostgreSQL, and Microsoft SQL Server all use SQL.
          `,
          description: 'A comprehensive introduction to SQL and relational databases.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 10 
        },
        { 
          title: 'Understanding Big Data', 
          content: `
            Big Data refers to datasets that are so large and complex that traditional data processing 
            applications are inadequate. The key challenges of Big Data include data storage, processing, and analysis. 
            Technologies such as Hadoop and Apache Spark have been developed to handle these challenges by enabling 
            distributed storage and parallel processing. Big Data has applications in fields like marketing, 
            healthcare, and social media, providing valuable insights that can influence business decisions.
          `,
          description: 'An overview of Big Data and its impact on industries.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 1 
        },
        { 
          title: 'Getting Started with Mobile App Development', 
          content: `
            Mobile app development is the process of creating applications that run on smartphones and tablets. 
            There are two main platforms for mobile apps: iOS and Android. Native apps are developed using platform-specific languages, 
            such as Swift for iOS and Kotlin for Android. Alternatively, cross-platform frameworks like Flutter and React Native 
            allow developers to write code once and deploy it on both platforms. Mobile app development involves UI design, 
            backend integration, and optimization for performance and battery life.
          `,
          description: 'A beginner’s guide to mobile app development and key considerations.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 2 
        },
        { 
          title: 'Exploring Virtual Reality (VR)', 
          content: `
            Virtual Reality (VR) is an immersive technology that simulates a user’s presence in a digital environment. 
            VR is primarily used in gaming and entertainment, but it also has applications in training, education, 
            and healthcare. Key components of VR systems include a headset, motion controllers, and sometimes gloves 
            or other devices for haptic feedback. As the technology advances, VR is becoming more affordable and accessible 
            for both consumers and businesses.
          `,
          description: 'Learn about the foundations of virtual reality and its applications.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 3 
        },
        { 
          title: 'The Role of DevOps in Modern Software Development', 
          content: `
            DevOps is a cultural and technical movement that emphasizes collaboration between software development 
            and IT operations teams. The goal is to shorten development cycles, increase deployment frequency, 
            and ensure higher quality software. DevOps practices include continuous integration (CI), continuous delivery (CD), 
            and infrastructure automation. By implementing DevOps, organizations can accelerate software delivery, improve 
            collaboration, and reduce time-to-market.
          `,
          description: 'An overview of DevOps principles and how they improve software development.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 4 
        },
        { 
          title: 'Getting Started with Django', 
          content: `
            Django is a high-level Python web framework that enables rapid development of secure and scalable web applications. 
            It follows the Model-View-Template (MVT) architecture and comes with built-in features such as an admin panel, 
            user authentication, and form handling. Django’s focus on reusability and "Don’t Repeat Yourself" (DRY) 
            principles allows developers to create complex applications with fewer lines of code. Whether you’re building a 
            blog, e-commerce site, or social network, Django provides the tools and flexibility needed for a wide range of projects.
          `,
          description: 'A beginner’s guide to developing web applications with Django.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 5 
        },
        { 
          title: 'Introduction to Git and GitHub', 
          content: `
            Git is a distributed version control system that allows multiple developers to collaborate on software projects. 
            It tracks changes in code and enables developers to revert to previous versions if necessary. GitHub, a popular platform 
            for hosting Git repositories, provides additional collaboration features like pull requests, issue tracking, and project boards. 
            By mastering Git, developers can streamline their workflow, improve collaboration, and ensure that code changes 
            are carefully managed and reviewed.
          `,
          description: 'Understanding the basics of Git and how to use GitHub for collaboration.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 6 
        },
        { 
          title: 'The Future of 5G Technology', 
          content: `
            5G is the fifth generation of mobile network technology, designed to offer faster speeds, lower latency, 
            and greater capacity compared to previous generations. 5G will enable new technologies such as autonomous vehicles, 
            smart cities, and the Internet of Things (IoT). It will also improve mobile broadband services and provide 
            faster download speeds. The rollout of 5G networks is already underway in many parts of the world, 
            and it is expected to have a profound impact on industries ranging from healthcare to entertainment.
          `,
          description: 'Explore how 5G technology will shape the future of communication.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 7 
        },
        { 
          title: 'Introduction to Ethical Hacking', 
          content: `
            Ethical hacking, also known as penetration testing, is the practice of testing computer systems, 
            networks, or applications for security vulnerabilities in a lawful and authorized manner. Ethical hackers use 
            the same tools and techniques as malicious hackers but with the permission of the system owner. 
            The goal is to identify weaknesses before they can be exploited by cybercriminals. Ethical hacking is a 
            crucial component of a comprehensive cybersecurity strategy, helping organizations protect sensitive data 
            and maintain the trust of their customers.
          `,
          description: 'Understanding ethical hacking and its role in cybersecurity.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 8 
        },
        { 
          title: 'Exploring the Internet of Things (IoT)', 
          content: `
            The Internet of Things (IoT) refers to the interconnection of everyday objects through the internet, 
            enabling them to collect and exchange data. Examples of IoT devices include smart thermostats, 
            wearable fitness trackers, and connected home appliances. IoT has the potential to transform industries 
            by enabling real-time monitoring and data analysis. However, IoT also raises concerns about security 
            and privacy, as more devices become interconnected and generate vast amounts of data.
          `,
          description: 'Learn about IoT and its transformative potential across industries.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 9 
        },
        { 
          title: 'What is Augmented Reality (AR)?', 
          content: `
            Augmented Reality (AR) is a technology that overlays digital information, such as images or sounds, 
            onto the real world. AR can be experienced through devices like smartphones, tablets, or specialized glasses. 
            AR has gained popularity in gaming (e.g., Pokémon Go) but is also used in fields like education, retail, 
            and healthcare. By enhancing real-world experiences, AR opens up new possibilities for how we interact 
            with our environment and engage with information.
          `,
          description: 'An introduction to AR and its uses in various industries.',
          isDeleted: false, 
          isAppropriate: true, 
          authorId: 10 
        }
      ],
    });

    // Create dummy blog tags
    await prisma.blogTags.createMany({
      data: [
        { tagId: 1, blogId: 1 }, // "Computer Science" -> "Understanding JavaScript"
        { tagId: 2, blogId: 1 }, // "Math" -> "Understanding JavaScript"
        { tagId: 4, blogId: 2 }, // "Python" -> "Introduction to Python"
        { tagId: 2, blogId: 2 }, // "Math" -> "Introduction to Python"
        { tagId: 1, blogId: 3 }, // "Computer Science" -> "The Basics of Artificial Intelligence"
        { tagId: 4, blogId: 3 }, // "Python" -> "The Basics of Artificial Intelligence"
        { tagId: 1, blogId: 4 }, // "Computer Science" -> "Understanding Cybersecurity"
        { tagId: 5, blogId: 4 }, // "Java" -> "Understanding Cybersecurity"
        { tagId: 1, blogId: 5 }, // "Computer Science" -> "Blockchain Technology Explained"
        { tagId: 7, blogId: 5 }, // "Haskell" -> "Blockchain Technology Explained"
        { tagId: 4, blogId: 6 }, // "Python" -> "Building Your First Web Application"
        { tagId: 8, blogId: 6 }, // "DP" -> "Building Your First Web Application"
        { tagId: 6, blogId: 7 }, // "Go" -> "Cloud Computing for Beginners"
        { tagId: 9, blogId: 7 }, // "Arrays" -> "Cloud Computing for Beginners"
        { tagId: 1, blogId: 8 }, // "Computer Science" -> "Introduction to React.js"
        { tagId: 4, blogId: 8 }, // "Python" -> "Introduction to React.js"
        { tagId: 1, blogId: 9 }, // "Computer Science" -> "Exploring Node.js"
        { tagId: 6, blogId: 9 }, // "Go" -> "Exploring Node.js"
        { tagId: 10, blogId: 10 }, // "Debug" -> "Learning SQL for Databases"
        { tagId: 9, blogId: 10 }, // "Arrays" -> "Learning SQL for Databases"
        { tagId: 1, blogId: 11 }, // "Computer Science" -> "Understanding Big Data"
        { tagId: 2, blogId: 11 }, // "Math" -> "Understanding Big Data"
        { tagId: 1, blogId: 12 }, // "Computer Science" -> "Getting Started with Mobile App Development"
        { tagId: 4, blogId: 12 }, // "Python" -> "Getting Started with Mobile App Development"
        { tagId: 1, blogId: 13 }, // "Computer Science" -> "Exploring Virtual Reality (VR)"
        { tagId: 4, blogId: 13 }, // "Python" -> "Exploring Virtual Reality (VR)"
        { tagId: 1, blogId: 14 }, // "Computer Science" -> "The Role of DevOps in Modern Software Development"
        { tagId: 5, blogId: 14 }, // "Java" -> "The Role of DevOps in Modern Software Development"
        { tagId: 6, blogId: 15 }, // "Go" -> "Getting Started with Django"
        { tagId: 4, blogId: 15 }, // "Python" -> "Getting Started with Django"
        { tagId: 1, blogId: 16 }, // "Computer Science" -> "Introduction to Git and GitHub"
        { tagId: 10, blogId: 16 }, // "Debug" -> "Introduction to Git and GitHub"
        { tagId: 7, blogId: 17 }, // "Haskell" -> "The Future of 5G Technology"
        { tagId: 6, blogId: 17 }, // "Go" -> "The Future of 5G Technology"
        { tagId: 2, blogId: 18 }, // "Math" -> "Introduction to Ethical Hacking"
        { tagId: 1, blogId: 18 }, // "Computer Science" -> "Introduction to Ethical Hacking"
        { tagId: 1, blogId: 19 }, // "Computer Science" -> "Exploring the Internet of Things (IoT)"
        { tagId: 9, blogId: 19 }, // "Arrays" -> "Exploring the Internet of Things (IoT)"
        { tagId: 1, blogId: 20 }, // "Computer Science" -> "What is Augmented Reality (AR)?"
        { tagId: 7, blogId: 20 }, // "Haskell" -> "What is Augmented Reality (AR)?"
        { tagId: 11, blogId: 1 }, // "Artificial Intelligence" -> "Understanding JavaScript"
        { tagId: 12, blogId: 2 }, // "Machine Learning" -> "Introduction to Python"
        { tagId: 13, blogId: 3 }, // "Blockchain" -> "The Basics of Artificial Intelligence"
        { tagId: 14, blogId: 4 }, // "Web Development" -> "Understanding Cybersecurity"
        { tagId: 15, blogId: 5 }, // "Cloud" -> "Blockchain Technology Explained"
        { tagId: 16, blogId: 6 }, // "Security" -> "Building Your First Web Application"
        { tagId: 17, blogId: 7 }, // "React" -> "Cloud Computing for Beginners"
        { tagId: 18, blogId: 8 }, // "Node" -> "Introduction to React.js"
        { tagId: 19, blogId: 9 }, // "SQL" -> "Exploring Node.js"
        { tagId: 20, blogId: 10 }, // "VR/AR" -> "Learning SQL for Databases"
        { tagId: 11, blogId: 11 }, // "Artificial Intelligence" -> "Understanding Big Data"
        { tagId: 12, blogId: 12 }, // "Machine Learning" -> "Getting Started with Mobile App Development"
        { tagId: 13, blogId: 13 }, // "Blockchain" -> "Exploring Virtual Reality (VR)"
        { tagId: 14, blogId: 14 }, // "Web Development" -> "The Role of DevOps in Modern Software Development"
        { tagId: 15, blogId: 15 }, // "Cloud" -> "Getting Started with Django"
        { tagId: 16, blogId: 16 }, // "Security" -> "Introduction to Git and GitHub"
        { tagId: 17, blogId: 17 }, // "React" -> "The Future of 5G Technology"
        { tagId: 18, blogId: 18 }, // "Node" -> "Introduction to Ethical Hacking"
        { tagId: 19, blogId: 19 }, // "SQL" -> "Exploring the Internet of Things (IoT)"
        { tagId: 20, blogId: 20 }, // "VR/AR" -> "What is Augmented Reality (AR)?"
      ],
    });
      
  // Create dummy user ratings
  await prisma.blogRating.createMany({
    data: [
      { userId: 1, blogId: 1, rating: 1 },  // User 1 upvotes Blog 1
      { userId: 1, blogId: 2, rating: -1 }, // User 1 downvotes Blog 2
      { userId: 2, blogId: 1, rating: 1 },  // User 2 upvotes Blog 1
      { userId: 2, blogId: 3, rating: -1 }, // User 2 downvotes Blog 3
      { userId: 1, blogId: 3, rating: 1 },  // User 1 upvotes Blog 3
      { userId: 3, blogId: 4, rating: 1 },  // User 3 upvotes Blog 4
      { userId: 3, blogId: 5, rating: -1 }, // User 3 downvotes Blog 5
      { userId: 4, blogId: 6, rating: 1 },  // User 4 upvotes Blog 6
      { userId: 4, blogId: 7, rating: -1 }, // User 4 downvotes Blog 7
      { userId: 5, blogId: 8, rating: 1 },  // User 5 upvotes Blog 8
      { userId: 5, blogId: 9, rating: -1 }, // User 5 downvotes Blog 9
    ],
  });

    // Create dummy comments
    await prisma.comment.createMany({
      data: [
        {
          "commentId": 1,
          "content": "Great post! Really informative.",
          "isAppropriate": true,
          "upvotes": 3,
          "downvotes": 1,
          "userId": 3,
          "blogId": 1,
          "createdAt": "2024-11-27T00:00:00Z",
          "updatedAt": "2024-11-27T00:00:00Z"
        },
        {
          "commentId": 2,
          "content": "I disagree with some points made here.",
          "isAppropriate": true,
          "upvotes": 2,
          "downvotes": 2,
          "userId": 7,
          "blogId": 1,
          "createdAt": "2024-11-27T00:01:00Z",
          "updatedAt": "2024-11-27T00:01:00Z"
        },
        {
          "commentId": 3,
          "content": "Interesting perspective, but I need more details.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 8,
          "blogId": 2,
          "createdAt": "2024-11-27T00:02:00Z",
          "updatedAt": "2024-11-27T00:02:00Z"
        },
        {
          "commentId": 4,
          "content": "I love this! Keep up the great work!",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 1,
          "blogId": 3,
          "createdAt": "2024-11-27T00:03:00Z",
          "updatedAt": "2024-11-27T00:03:00Z"
        },
        {
          "commentId": 5,
          "content": "Can you provide more sources to back this up?",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 2,
          "blogId": 3,
          "createdAt": "2024-11-27T00:04:00Z",
          "updatedAt": "2024-11-27T00:04:00Z"
        },
        {
          "commentId": 6,
          "content": "I'm not sure I agree, but I see your point.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 6,
          "blogId": 4,
          "createdAt": "2024-11-27T00:05:00Z",
          "updatedAt": "2024-11-27T00:05:00Z"
        },
        {
          "commentId": 7,
          "content": "This article changed my mind on the topic!",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 10,
          "blogId": 5,
          "createdAt": "2024-11-27T00:06:00Z",
          "updatedAt": "2024-11-27T00:06:00Z"
        },
        {
          "commentId": 8,
          "content": "I don't think this is entirely accurate, though.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 4,
          "blogId": 5,
          "createdAt": "2024-11-27T00:07:00Z",
          "updatedAt": "2024-11-27T00:07:00Z"
        },
        {
          "commentId": 9,
          "content": "Thank you for sharing this! It's really helpful.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 5,
          "blogId": 6,
          "createdAt": "2024-11-27T00:08:00Z",
          "updatedAt": "2024-11-27T00:08:00Z"
        },
        {
          "commentId": 10,
          "content": "This article is misleading in some ways.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 9,
          "blogId": 6,
          "createdAt": "2024-11-27T00:09:00Z",
          "updatedAt": "2024-11-27T00:09:00Z"
        },
        {
          "commentId": 11,
          "content": "Fantastic read! I'd love to see more posts like this.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 3,
          "blogId": 7,
          "createdAt": "2024-11-27T00:10:00Z",
          "updatedAt": "2024-11-27T00:10:00Z"
        },
        {
          "commentId": 12,
          "content": "I'm not convinced, there are too many flaws here.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 7,
          "blogId": 7,
          "createdAt": "2024-11-27T00:11:00Z",
          "updatedAt": "2024-11-27T00:11:00Z"
        },
        {
          "commentId": 13,
          "content": "This really helped clarify things for me, thanks!",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 8,
          "blogId": 8,
          "createdAt": "2024-11-27T00:12:00Z",
          "updatedAt": "2024-11-27T00:12:00Z"
        },
        {
          "commentId": 14,
          "content": "I think you missed an important point here.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 1,
          "blogId": 8,
          "createdAt": "2024-11-27T00:13:00Z",
          "updatedAt": "2024-11-27T00:13:00Z"
        },
        {
          "commentId": 15,
          "content": "Your writing is excellent, but the argument is weak.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 2,
          "blogId": 9,
          "createdAt": "2024-11-27T00:14:00Z",
          "updatedAt": "2024-11-27T00:14:00Z"
        },
        {
          "commentId": 16,
          "content": "This is exactly what I was looking for! Thank you.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 6,
          "blogId": 9,
          "createdAt": "2024-11-27T00:15:00Z",
          "updatedAt": "2024-11-27T00:15:00Z"
        },
        {
          "commentId": 17,
          "content": "I don't think this is accurate based on what I know.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 10,
          "blogId": 10,
          "createdAt": "2024-11-27T00:16:00Z",
          "updatedAt": "2024-11-27T00:16:00Z"
        },
        {
          "commentId": 18,
          "content": "Can you explain this in more detail? It's unclear.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 4,
          "blogId": 10,
          "createdAt": "2024-11-27T00:17:00Z",
          "updatedAt": "2024-11-27T00:17:00Z"
        },
        {
          "commentId": 19,
          "content": "Your article gave me a new perspective on this.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 5,
          "blogId": 11,
          "createdAt": "2024-11-27T00:18:00Z",
          "updatedAt": "2024-11-27T00:18:00Z"
        },
        {
          "commentId": 20,
          "content": "I still think there's some confusion around this topic.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 9,
          "blogId": 11,
          "createdAt": "2024-11-27T00:19:00Z",
          "updatedAt": "2024-11-27T00:19:00Z"
        },
        {
          "commentId": 21,
          "content": "Incredible insights! I learned a lot.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 3,
          "blogId": 12,
          "createdAt": "2024-11-27T00:20:00Z",
          "updatedAt": "2024-11-27T00:20:00Z"
        },
        {
          "commentId": 22,
          "content": "This is highly inaccurate in my opinion.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 7,
          "blogId": 12,
          "createdAt": "2024-11-27T00:21:00Z",
          "updatedAt": "2024-11-27T00:21:00Z"
        },
        {
          "commentId": 23,
          "content": "I appreciate the effort, but there are too many inconsistencies.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 8,
          "blogId": 13,
          "createdAt": "2024-11-27T00:22:00Z",
          "updatedAt": "2024-11-27T00:22:00Z"
        },
        {
          "commentId": 24,
          "content": "This post could use more research and data.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 1,
          "blogId": 13,
          "createdAt": "2024-11-27T00:23:00Z",
          "updatedAt": "2024-11-27T00:23:00Z"
        },
        {
          "commentId": 25,
          "content": "I don't agree with everything, but this is a good start.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 2,
          "blogId": 14,
          "createdAt": "2024-11-27T00:24:00Z",
          "updatedAt": "2024-11-27T00:24:00Z"
        },
        {
          "commentId": 26,
          "content": "This is a well-written article, but the data seems flawed.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 6,
          "blogId": 14,
          "createdAt": "2024-11-27T00:25:00Z",
          "updatedAt": "2024-11-27T00:25:00Z"
        },
        {
          "commentId": 27,
          "content": "Good point, but I believe there's more to consider.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 10,
          "blogId": 15,
          "createdAt": "2024-11-27T00:26:00Z",
          "updatedAt": "2024-11-27T00:26:00Z"
        },
        {
          "commentId": 28,
          "content": "Very insightful! You've made some strong arguments.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 4,
          "blogId": 15,
          "createdAt": "2024-11-27T00:27:00Z",
          "updatedAt": "2024-11-27T00:27:00Z"
        },
        {
          "commentId": 29,
          "content": "This was an interesting read, thanks for sharing!",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 5,
          "blogId": 16,
          "createdAt": "2024-11-27T00:28:00Z",
          "updatedAt": "2024-11-27T00:28:00Z"
        },
        {
          "commentId": 30,
          "content": "I'm skeptical about the conclusions, but it's well-written.",
          "isAppropriate": true,
          "upvotes": 0,
          "downvotes": 0,
          "userId": 9,
          "blogId": 16,
          "createdAt": "2024-11-27T00:29:00Z",
          "updatedAt": "2024-11-27T00:29:00Z"
        }
      ]      
    });

// Create dummy comment replies (Ensuring the replies belong to the same blog post as the original comment)
await prisma.commentReply.createMany({
  data: [
    {
      "commentId": 1,
      "replyId": 2
    },
    {
      "commentId": 7,
      "replyId": 8
    },
    {
      "commentId": 13,
      "replyId": 14
    },
    {
      "commentId": 4,
      "replyId": 5
    }
  ]
  ,
});



    // Create dummy user comment ratings
    await prisma.userCommentRating.createMany({
      data: [
        // For commentId 1
        {
          "userId": 3,
          "commentId": 1,
          "rating": 1
        },
        {
          "userId": 4,
          "commentId": 1,
          "rating": 1
        },
        {
          "userId": 5,
          "commentId": 1,
          "rating": 1
        },
        {
          "userId": 6,
          "commentId": 1,
          "rating": -1
        },
      
        // For commentId 2
        {
          "userId": 7,
          "commentId": 2,
          "rating": 1
        },
        {
          "userId": 8,
          "commentId": 2,
          "rating": 1
        },
        {
          "userId": 9,
          "commentId": 2,
          "rating": -1
        },
        {
          "userId": 10,
          "commentId": 2,
          "rating": -1
        }
      ],
    });

  // Create dummy blog templates linking blog posts to templates
  await prisma.blogTemplate.createMany({
    data: [
      { templateId: 1, blogId: 1 }, // Link Template 1 to Blog 1
      { templateId: 2, blogId: 1 }, // Link Template 2 to Blog 1
      { templateId: 3, blogId: 1 }, // Link Template 3 to Blog 1
      { templateId: 4, blogId: 2 }, // Link Template 4 to Blog 2
      { templateId: 5, blogId: 2 }, // Link Template 5 to Blog 2
      { templateId: 6, blogId: 2 }, // Link Template 6 to Blog 2
      { templateId: 7, blogId: 3 }, // Link Template 7 to Blog 3
      { templateId: 8, blogId: 3 }, // Link Template 8 to Blog 3
      { templateId: 9, blogId: 3 }, // Link Template 9 to Blog 3
      { templateId: 10, blogId: 4 }, // Link Template 10 to Blog 4
      { templateId: 11, blogId: 4 }, // Link Template 11 to Blog 4
      { templateId: 12, blogId: 4 }, // Link Template 12 to Blog 4
      { templateId: 13, blogId: 5 }, // Link Template 13 to Blog 5
      { templateId: 14, blogId: 5 }, // Link Template 14 to Blog 5
      { templateId: 15, blogId: 5 }, // Link Template 15 to Blog 5
      { templateId: 16, blogId: 6 }, // Link Template 16 to Blog 6
      { templateId: 17, blogId: 6 }, // Link Template 17 to Blog 6
      { templateId: 18, blogId: 6 }, // Link Template 18 to Blog 6
      { templateId: 19, blogId: 7 }, // Link Template 19 to Blog 7
      { templateId: 20, blogId: 7 }, // Link Template 20 to Blog 7
    ],
  });

      // Create dummy comment reports
      await prisma.commentReport.createMany({ data: [
        { commentId: 1, userId: 1, explanation: 'Inappropriate content.' },
        { commentId: 2, userId: 2, explanation: 'Spam or irrelevant comment.' },
        { commentId: 3, userId: 3, explanation: 'Offensive language.' },
      ] });
    
      await prisma.blogReport.createMany({ data: [
        { blogId: 1, userId: 1, explanation: 'Contains false information.' },
        { blogId: 2, userId: 2, explanation: 'Misleading title.' },
        { blogId: 3, userId: 1, explanation: 'Inappropriate content.' },
      ]
     });
  } catch (error) {
      console.log(`Error processing seeding data ${error}`);
    }
  }

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
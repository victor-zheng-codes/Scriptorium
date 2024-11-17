
import { PrismaClient } from '@prisma/client';
import * as fs from "fs";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
  try{
    const seededUsers = JSON.parse(fs.readFileSync('prisma/dummy-users.json', 'utf-8'));

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
    { tagName: 'Go' }, // 8
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
          templateId: 1, 
          userId: 1, 
          title: 'Python3 Hello World', 
          description: "Hello World Example", 
          content: 'print("Hello, World!")', 
          language: "python" 
        },
        { 
          templateId: 2, 
          userId: 1, 
          title: 'Python3 Arithmetic', 
          description: "Simple addition in Python", 
          content: 'a = 10\nb = 20\nprint(a + b)', 
          language: "python" 
        },

        // JavaScript
        { 
          templateId: 3, 
          userId: 2, 
          title: 'JavaScript Hello World', 
          description: "Hello World in JavaScript", 
          content: 'console.log("Hello, World!");', 
          language: "javascript" 
        },
        { 
          templateId: 4, 
          userId: 2, 
          title: 'JavaScript Sum Function', 
          description: "A simple sum function", 
          content: 'function sum(a, b) {\n  return a + b;\n}\nconsole.log(sum(3, 5));', 
          language: "javascript" 
        },

        // Java
        { 
          templateId: 5, 
          userId: 3, 
          title: 'Java Hello World', 
          description: "Hello World in Java", 
          content: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}', 
          language: "java" 
        },
        { 
          templateId: 6, 
          userId: 3, 
          title: 'Java Loop Example', 
          description: "A simple for-loop in Java", 
          content: 'for (int i = 0; i < 5; i++) {\n  System.out.println("Iteration " + i);\n}', 
          language: "java" 
        },

        // C#
        { 
          templateId: 7, 
          userId: 4, 
          title: 'C# Hello World', 
          description: "Hello World in C#", 
          content: 'using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, World!");\n  }\n}', 
          language: "csharp" 
        },
        { 
          templateId: 8, 
          userId: 4, 
          title: 'C# Array Example', 
          description: "Working with arrays in C#", 
          content: 'int[] numbers = {1, 2, 3, 4};\nforeach (int number in numbers) {\n  Console.WriteLine(number);\n}', 
          language: "csharp" 
        },

        // Ruby
        { 
          templateId: 9, 
          userId: 5, 
          title: 'Ruby Hello World', 
          description: "Hello World in Ruby", 
          content: 'puts "Hello, World!"', 
          language: "ruby" 
        },
        { 
          templateId: 10, 
          userId: 5, 
          title: 'Ruby Block Example', 
          description: "A simple block in Ruby", 
          content: '[1, 2, 3].each { |x| puts x }', 
          language: "ruby" 
        },

        // Go
        { 
          templateId: 11, 
          userId: 6, 
          title: 'Go Hello World', 
          description: "Hello World in Go", 
          content: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}', 
          language: "go" 
        },
        { 
          templateId: 12, 
          userId: 6, 
          title: 'Go Function Example', 
          description: "A function example in Go", 
          content: 'package main\n\nfunc add(a int, b int) int {\n    return a + b\n}\n\nfunc main() {\n    fmt.Println(add(2, 3))\n}', 
          language: "go" 
        },

        // C++
        { 
          templateId: 13, 
          userId: 7, 
          title: 'C++ Hello World', 
          description: "Hello World in C++", 
          content: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}', 
          language: "cpp" 
        },
        { 
          templateId: 14, 
          userId: 7, 
          title: 'C++ Conditional Example', 
          description: "An if-statement in C++", 
          content: 'int a = 10;\nif (a > 5) {\n    std::cout << "a is greater than 5";\n}', 
          language: "cpp" 
        },

        // PHP
        { 
          templateId: 15, 
          userId: 8, 
          title: 'PHP Hello World', 
          description: "Hello World in PHP", 
          content: '<?php\n  echo "Hello, World!";\n?>', 
          language: "php" 
        },
        { 
          templateId: 16, 
          userId: 8, 
          title: 'PHP Array Example', 
          description: "An array example in PHP", 
          content: '<?php\n  $arr = [1, 2, 3];\n  foreach ($arr as $value) {\n    echo $value . "\\n";\n  }\n?>', 
          language: "php" 
        },

        // Kotlin
        { 
          templateId: 17, 
          userId: 9, 
          title: 'Kotlin Hello World', 
          description: "Hello World in Kotlin", 
          content: 'fun main() {\n    println("Hello, World!")\n}', 
          language: "kotlin" 
        },
        { 
          templateId: 18, 
          userId: 9, 
          title: 'Kotlin Class Example', 
          description: "A simple class in Kotlin", 
          content: 'class Person(val name: String) {\n    fun greet() {\n        println("Hello, $name")\n    }\n}\n\nfun main() {\n    val p = Person("Alice")\n    p.greet()\n}', 
          language: "kotlin" 
        },

        // Swift
        { 
          templateId: 19, 
          userId: 10, 
          title: 'Swift Hello World', 
          description: "Hello World in Swift", 
          content: 'import Foundation\n\nprint("Hello, World!")', 
          language: "swift" 
        },
        { 
          templateId: 20, 
          userId: 10, 
          title: 'Swift Array Example', 
          description: "Working with arrays in Swift", 
          content: 'let numbers = [1, 2, 3]\nfor number in numbers {\n    print(number)\n}', 
          language: "swift" 
        },

        // R
        { 
          templateId: 21, 
          userId: 11, 
          title: 'R Hello World', 
          description: "Hello World in R", 
          content: 'cat("Hello, World!")', 
          language: "r" 
        },
        { 
          templateId: 22, 
          userId: 11, 
          title: 'R Plot Example', 
          description: "A basic plot in R", 
          content: 'plot(1:10, main="Simple Plot")', 
          language: "r" 
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

        // C# Templates
        { tagId: 6, templateId: 7 }, // C#
        { tagId: 18, templateId: 7 }, // Hello World
        { tagId: 14, templateId: 8 }, // Arrays
        { tagId: 16, templateId: 8 }, // Loops

        // Ruby Templates
        { tagId: 7, templateId: 9 }, // Ruby
        { tagId: 18, templateId: 9 }, // Hello World
        { tagId: 16, templateId: 10 }, // Loops
        { tagId: 17, templateId: 10 }, // Console Output

        // Go Templates
        { tagId: 8, templateId: 11 }, // Go
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

        // Kotlin Templates
        { tagId: 11, templateId: 17 }, // Kotlin
        { tagId: 18, templateId: 17 }, // Hello World
        { tagId: 20, templateId: 18 }, // Classes and Objects
        { tagId: 15, templateId: 18 }, // Functions

        // Swift Templates
        { tagId: 12, templateId: 19 }, // Swift
        { tagId: 18, templateId: 19 }, // Hello World
        { tagId: 14, templateId: 20 }, // Arrays
        { tagId: 17, templateId: 20 }, // Console Output

        // R Templates
        { tagId: 13, templateId: 21 }, // R
        { tagId: 18, templateId: 21 }, // Hello World
        { tagId: 19, templateId: 22 }, // Data Visualization
        { tagId: 17, templateId: 22 }, // Console Output
      ],
    });

    await prisma.blog.createMany({
      data: [
        { title: 'Understanding JavaScript', content: 'hello world this is a test of javascirpt testing', description: 'Placeholder description ----sdajkblgdaskhlgshklgshkl', isDeleted: false, isAppropriate: true, authorId: 1 },
        { title: 'Tech Innovations',  content: 'tech invoation content template for testing klasdghsdlghkdsklgdsklgsdklhghklsa', description: 'The latest trends in technology and what they mean for the future.', isDeleted: false, isAppropriate: true, authorId: 1 },
      ],
    });

    // Create dummy blog tags
    await prisma.blogTags.createMany({
      data: [
        { tagId: 1, blogId: 1 },
        { tagId: 2, blogId: 1 },
        { tagId: 3, blogId: 2 },
        { tagId: 4, blogId: 3 },
        { tagId: 5, blogId: 4 },
        { tagId: 6, blogId: 5 },
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
      ],
    });

    // Create dummy comments
    await prisma.comment.createMany({
      data: [
        { userId: 1, content: 'Great post! Very informative.', upvotes: 5, downvotes: 0, blogId: 1 },
        { userId: 1, content: 'I disagree with some points made here.', upvotes: 0, downvotes: 3, blogId: 1 },
        { userId: 1, content: 'Thanks for sharing this!', upvotes: 2, downvotes: 0, blogId: 2 },
        { userId: 1, content: 'This is a useful resource for beginners.', upvotes: 10, downvotes: 1, blogId: 3 },
        { userId: 1, content: 'I found this article lacking in detail.', upvotes: 1, downvotes: 4, blogId: 4 },
      ],
    });

    // Create dummy user comment ratings
    await prisma.userCommentRating.createMany({
      data: [
        { userId: 1, commentId: 1, rating: 1 },  // User 1 upvotes Comment 1
        { userId: 1, commentId: 2, rating: -1 }, // User 1 downvotes Comment 2
        { userId: 2, commentId: 1, rating: 1 },  // User 2 upvotes Comment 1
        { userId: 2, commentId: 3, rating: -1 }, // User 2 downvotes Comment 3
        { userId: 1, commentId: 3, rating: 1 },  // User 1 upvotes Comment 3
      ],
    });

    // Create dummy comment replies
    await prisma.commentReply.createMany({
      data: [
        { commentId: 1, replyId: 2 }, // Reply 2 is a reply to Comment 1
        { commentId: 1, replyId: 3 }, // Reply 3 is another reply to Comment 1
        { commentId: 2, replyId: 4 }, // Reply 4 is a reply to Comment 2
        { commentId: 3, replyId: 5 }, // Reply 5 is a reply to Comment 3
      ],
    });

    // Create dummy blog templates
    await prisma.blogTemplate.createMany({
      data: [
        { templateId: 1, blogId: 1 }, // Link Template 1 to Blog 1
        { templateId: 2, blogId: 1 }, // Link Template 2 to Blog 1
        { templateId: 3, blogId: 2 }, // Link Template 3 to Blog 2
        { templateId: 4, blogId: 3 }, // Link Template 4 to Blog 3
        { templateId: 5, blogId: 4 }, // Link Template 5 to Blog 4
      ],
    });


      // Create dummy comment reports
      const commentReports = [
        { commentId: 1, userId: 1, explanation: 'Inappropriate content.' },
        { commentId: 2, userId: 2, explanation: 'Spam or irrelevant comment.' },
        { commentId: 3, userId: 3, explanation: 'Offensive language.' },
      ];
    
      await prisma.commentReport.createMany({ data: commentReports });
    
      // Create dummy blog reports
      const blogReports = [
        { blogId: 1, userId: 1, explanation: 'Contains false information.' },
        { blogId: 2, userId: 2, explanation: 'Misleading title.' },
        { blogId: 3, userId: 1, explanation: 'Inappropriate content.' },
      ];

      await prisma.blogReport.createMany({ data: blogReports });
  } catch (error) {
      console.log(`Error processing seeding data ${error}`);
    }
  }

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
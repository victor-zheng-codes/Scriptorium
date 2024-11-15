
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
                  userId: user.userId,
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

    await prisma.tag.createMany({
      data: [
        { tagId: 1, tagName: 'Computer Science' },
        { tagId: 2, tagName: 'Math' },
        { tagId: 3, tagName: 'Physics' },
        { tagId: 4, tagName: 'Python' },
        { tagId: 5, tagName: 'Java' },
        { tagId: 6, tagName: 'Go' },
        { tagId: 7, tagName: 'Haskell' },
      ],
    });

    // Create dummy templates
    await prisma.template.createMany({
      data: [
        { templateId: 1, userId: 1, title: 'Project Proposal', content: 'This is a sample project proposal template.' },
        { templateId: 2, userId: 1, title: 'Meeting Agenda', content: 'This template outlines the agenda for our meetings.' },
        { templateId: 3, userId: 2, title: 'Report', content: 'This template can be used for various reports.' },
        { templateId: 4, userId: 2, title: 'Invoice', content: 'This is a sample invoice template.' },
        { templateId: 5, userId: 1, title: 'Email Template', content: 'Use this template for email communications.' },
      ],
    });

    // Create dummy template tags
    await prisma.templateTags.createMany({
      data: [
        { tagId: 1, templateId: 1 },
        { tagId: 2, templateId: 1 },
        { tagId: 3, templateId: 2 },
        { tagId: 4, templateId: 3 },
        { tagId: 5, templateId: 4 },
        { tagId: 6, templateId: 4 },
      ],
    });

    await prisma.blog.createMany({
      data: [
        { title: 'Understanding JavaScript', content: 'hello world this is a test of javascirpt testing', description: 'Placeholder description ----sdajkblgdaskhlgshklgshkl', isDeleted: false, isAppropriate: true, authorId: 1 },
        { title: 'The Art of Cooking', content: 'cooking template for testing sgklhsdghklhkldssdgkhl slkdhghsdkl', description: 'placehodlselkshdglksdhgklads ghaklsdghlksdlkghsdlk lk.', isDeleted: false, isAppropriate: true, authorId: 2 },
        { title: 'Traveling the World', content: 'travelling the world template template for testing klasdghsdlghkdsklgdsklgsdklhghklsa', description: 'placeholder descriptoin for sahldghklsdgklhdsgklsgklsdlgdskfldskfksdhgaldkhgkhlsdghkl.', isDeleted: false, isAppropriate: true, authorId: 1 },
        { title: 'Health and Wellness',  content: 'health and wellness content for testing klasdghsdlghkdsklgdsklgsdklhghklsa', description: 'How to maintain a healthy lifestyle in a busy world.', isDeleted: false, isAppropriate: true, authorId: 2 },
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
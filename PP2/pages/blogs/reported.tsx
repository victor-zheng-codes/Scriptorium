import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Layout from "@/components/ui/layout";
import ErrorPage from "next/error";

interface ReportedContent {
    id: number;
    content: string;
    reports: [];
    reports_num: number;
    type: "blog" | "comment";
    link?: string;
    isAppropriate: boolean; 
    showReports: boolean; // Add this field to handle visibility
}

const ReportedBlogsAndComments = () => {
    const [reportedBlogs, setReportedBlogs] = useState<ReportedContent[]>([]);
    const [reportedComments, setReportedComments] = useState<ReportedContent[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/404");
        }

        const fetchReports = async () => {
            try {
                const response = await fetch("/api/blogs/reports", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    router.push("/404");
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch reported content.");
                }

                const data = await response.json();

                console.log(data);

                const formattedBlogs = data.sortedBlogs.map((blog: any) => ({
                    id: blog.blogId,
                    content: blog.title,
                    reports: blog.BlogReport,
                    reports_num: blog.BlogReport.length,
                    type: "blog",
                    link: `/blogs/${blog.blogId}`,
                    isAppropriate: blog.isAppropriate, 
                    showReports: false, // Initialize showReports to false
                }));

                const formattedComments = data.sortedComments.map((comment: any) => ({
                    id: comment.commentId,
                    content: comment.content,
                    reports: comment.CommentReport,
                    reports_num: comment.CommentReport.length,
                    type: "comment",
                    link: `/blogs/${comment.blogId}`,
                    isAppropriate: comment.isAppropriate,
                    showReports: false, // Initialize showReports to false
                }));

                setReportedBlogs(formattedBlogs);
                setReportedComments(formattedComments);
            } catch (error: any) {
                setError(error.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [router]);

    const handleFlagContent = async (id: number, type: "blog" | "comment", isAppropriate: boolean) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("/api/blogs/reports", {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                 },
                body: JSON.stringify({ id, type, isAppropriate }),
            });

            if (!response.ok) {
                throw new Error("Failed to update content status.");
            }

            // Update the UI based on the response
            if (type === "blog") {
                setReportedBlogs((prev) =>
                    prev.map((blog) =>
                        blog.id === id
                            ? { ...blog, isAppropriate: isAppropriate }
                            : blog
                    )
                );
            } else if (type === "comment") {
                setReportedComments((prev) =>
                    prev.map((comment) =>
                        comment.id === id
                            ? { ...comment, isAppropriate: isAppropriate }
                            : comment
                    )
                );
            }
        } catch (error: any) {
            alert(error.message || "Failed to flag content.");
        }
    };

    if (loading) return <p>Loading...</p>;

    if (error) return <p className="text-red-500">{error}</p>;


    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 dark:text-white">Reported Content</h1>

                <div>
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">Reported Blogs</h2>
                    {reportedBlogs.length === 0 ? (
                        <p>No reported blogs.</p>
                    ) : (
                        <ul className="list-disc pl-5">
                            {reportedBlogs.map((blog) => (
                                <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-900 mb-4 dark:text-white">
                                    <div>
                                        <p>
                                            <strong>Title:</strong>{" "}
                                            <Link href={blog.link || "#"} className="text-blue-500 underline">
                                                {blog.content}
                                            </Link>
                                        </p>
                                        <p>
                                            <strong>Reports:</strong> {blog.reports_num}
                                        </p>
                                        <div className="mt-2">
                                            {blog.isAppropriate ? (
                                                <Button
                                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded"
                                                    onClick={() => handleFlagContent(blog.id, "blog", false)}
                                                >
                                                    Mark as Inappropriate
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="px-2 py-1 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded"
                                                    onClick={() => handleFlagContent(blog.id, "blog", true)}
                                                >
                                                    Mark as Appropriate
                                                </Button>
                                            )}
                                        </div>
                                        <div className="mt-2">
                                            {blog.reports_num > 0 && (
                                                <Button
                                                    className="px-2 py-1 bg-gray-500 text-white rounded"
                                                    onClick={() => {
                                                        setReportedBlogs((prev) =>
                                                            prev.map((item) =>
                                                                item.id === blog.id
                                                                    ? { ...item, showReports: !item.showReports }
                                                                    : item
                                                            )
                                                        );
                                                    }}
                                                >
                                                    {blog.showReports ? 'Hide Reports' : 'View Reports'}
                                                </Button>
                                            )}
                                        </div>

                                        {/* Show the reports if showReports is true */}
                                        {blog.showReports && (
                                            <div className="mt-2 p-4 bg-gray-100 rounded dark:bg-gray-800">
                                                {blog.reports.map((report: any) => (
                                                    <div key={report.user.userId} className="border-t border-gray-200 pt-2 mt-2">
                                                        <p><strong>Reporter Username:</strong> {report.user.username}</p>
                                                        <p><strong>Reporter User ID:</strong> {report.user.userId}</p>
                                                        <p><strong>Explanation:</strong> {report.explanation}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-6">
                    <h2 className="text-xl dark:text-white font-semibold mb-2">Reported Comments</h2>
                    {reportedComments.length === 0 ? (
                        <p>No reported comments.</p>
                    ) : (
                        <ul className="list-disc pl-5">
                            {reportedComments.map((comment) => (
                                <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-900 mb-4 dark:text-white">
                                    <div>
                                        <p>
                                            <strong>Comment Content:</strong> {comment.content}
                                        </p>
                                        <p>
                                            <strong>Reports:</strong> {comment.reports_num}
                                        </p>
                                        <p>
                                            <strong>
                                                <Link href={comment.link || "#"} className="text-blue-500 underline">
                                                    View Blog containing this Comment
                                                </Link>
                                            </strong>
                                        </p>
                                        <div className="mt-2">
                                            {comment.isAppropriate ? (
                                                <Button
                                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded"
                                                    onClick={() => handleFlagContent(comment.id, "comment", false)}
                                                >
                                                    Mark as Inappropriate
                                                </Button>
                                            ) : (
                                                <Button
                                                   className="px-2 py-1 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded"
                                                    onClick={() => handleFlagContent(comment.id, "comment", true)}
                                                >
                                                    Mark as Appropriate
                                                </Button>
                                            )}
                                        </div>
                                        <div className="mt-2">
                                            {comment.reports_num > 0 && (
                                                <Button
                                                    className="px-2 py-1 bg-gray-500 text-white rounded"
                                                    onClick={() => {
                                                        setReportedComments((prev) =>
                                                            prev.map((item) =>
                                                                item.id === comment.id
                                                                    ? { ...item, showReports: !item.showReports }
                                                                    : item
                                                            )
                                                        );
                                                    }}
                                                >
                                                    {comment.showReports ? 'Hide Reports' : 'View Reports'}
                                                </Button>
                                            )}
                                        </div>

                                        {/* Show the reports if showReports is true */}
                                        {comment.showReports && (
                                            <div className="mt-2 p-4 bg-gray-100 rounded dark:bg-gray-800">
                                                {comment.reports.map((report: any) => (
                                                    <div key={report.user.userId} className="border-t border-gray-200 pt-2 mt-2">
                                                        <p><strong>Reporter Username:</strong> {report.user.username}</p>
                                                        <p><strong>Reporter User ID:</strong> {report.user.userId}</p>
                                                        <p><strong>Explanation:</strong> {report.explanation}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ReportedBlogsAndComments;
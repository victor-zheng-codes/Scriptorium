import Image from 'next/image';

<Image
  src="/profile.jpg" // This points to /public/profile.jpg
  alt="Profile"
  width={96}
  height={96}
  className="object-cover rounded-full"
/>
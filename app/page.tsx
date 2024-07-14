import Image from "next/image";
import Link from "next/link";
import LoginForm from "./(auth)/LoginForm";

export default function Home() {
  return (
    <main >
      <LoginForm />
    </main>
  );
}

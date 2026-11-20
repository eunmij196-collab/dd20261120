"use client";

/** 누르면 확인 창을 띄우고, 확인했을 때만 폼을 제출하는 버튼 */
export default function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

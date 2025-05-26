import Navbar from "@/components/Navbar";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Navbar />
      <div className="Py-20">{children}</div>
    </div>
  );
};

export default layout;

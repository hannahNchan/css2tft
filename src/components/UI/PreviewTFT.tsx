interface PreviewTFTProps {
  css: string;
}

export default function PreviewTFT({ css }: PreviewTFTProps) {
  return (
    <div className="w-1/2 h-full bg-[#0d1117] text-white p-4">
      <style>{css}</style>
      <div className="flex items-center justify-center h-full">
        <div className="card">A</div>
      </div>
    </div>
  );
}

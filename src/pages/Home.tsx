import { useState } from 'react';
import CssEditor from '@components/UI/CssEditor';
import PreviewTFT from '@components/UI/PreviewTFT';
import { generateAdafruitCode } from '../lib/arduinoGen';

export default function Home() {
  const [css, setCss] = useState(
    `.card {\n background-color: #3498db;\n width: 100px;\n height: 50px;\n}`
  );

  const arduinoCode = generateAdafruitCode(css);

  return (
    <div className="flex h-screen">
      <CssEditor css={css} onChange={setCss} />
      <PreviewTFT css={css} />
      <textarea
        className="absolute bottom-0 left-0 right-0 bg-gray-900 text-green-400 p-4 text-xs h-40 w-full font-mono"
        readOnly
        value={arduinoCode}
      />
    </div>
  );
}

import { useState } from 'react';

import MainContentLayout from '../layouts/MainContentLayout';

function Test() {
  const [content, setContent] = useState('');
  return <MainContentLayout>{content}</MainContentLayout>;
}

export default Test;

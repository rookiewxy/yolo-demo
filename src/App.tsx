import { Upload, UploadFile } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import './App.css'
import { useState } from 'react';

import { HfInference } from '@huggingface/inference'

const hf = new HfInference('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')


function App() {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [label, setLabel] = useState<string[]>([])
  const [countOccurrences, setCountOccurrences] = useState({})


  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
    handleObjectDetection(fileList[fileList.length - 1].originFileObj!)
  }

  const handleObjectDetection = async (data: Blob) => {
    const res = await hf.imageClassification({
      data: 'https://xtspace.cc:8888/1.webp',
      model: 'hustvl/yolos-tiny'
    })
    debugger
    const labels = res.map(d => d.label)
    setLabel(labels as string[])

    const countOccurrences = labels.reduce((acc, label) => {
      acc[label] = (acc[label] || 0) + 1; // 如果当前 label 已存在则加1，否则初始化为1
      return acc;
    }, {} as any);
    setCountOccurrences(countOccurrences)
  }
  return (
    <>
      <p className='title'>AI Image Detector</p>
      <div className='outerbox'>
        <div className="left">
          <Upload
            action=""
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : <div className='upload-btn'>
              <PlusOutlined />
              <div >Upload</div>
            </div>}
          </Upload>

        </div>
        <div className="right">
          {
            Object.keys(countOccurrences).map((key, i) => (
              <div className="item" key={i}>{`${key}  (+${countOccurrences[key]})`}</div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default App

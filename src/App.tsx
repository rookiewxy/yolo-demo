import { Upload, UploadFile } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import './App.css'
import { useState } from 'react';

import { HfInference } from '@huggingface/inference'

const hf = new HfInference('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')


function App() {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [label, setLabel] = useState([])
  const handleChange  = ({ fileList }:{fileList:UploadFile[]}) =>{
    setFileList(fileList);
    handleObjectDetection(fileList[fileList.length-1].originFileObj!)
  }

  const handleObjectDetection = async (data:Blob)=>{
    const res = await hf.objectDetection({
      data,
      model: 'facebook/detr-resnet-50'
    })
    setLabel(res[0].label.split(','))
    console.log(res,res[0].label.split(','))
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
          {fileList.length >= 8 ? null :  <div className='upload-btn'>
          <PlusOutlined />
          <div >Upload</div>
        </div>}
        </Upload>

        </div>
        <div className="right">
          {label.map((l,i) => <div className="item" key={i}>{l}</div> )}
        </div>
      </div>
    </>
  )
}

export default App

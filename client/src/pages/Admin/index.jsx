import React from 'react'
import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore"; 
import db from '../../firebase';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Editors from '../../components/TextEditor';
const Admin = () => {

  const getauth = getAuth();
  const navigate = useNavigate()
  onAuthStateChanged(getauth, (user) => {
    if(user){
      navigate('/signin')
      return
    }
  })
  const [content, setContent] = useState('')
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            
            const storageRef = ref(storage,file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', 
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              setProgress(progress.toFixed(2));
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            }, 
            (error) => {
              console.log(error)
            }, 
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                setFileUrl(downloadURL);
                setFileUploaded(true);
              });
            }
          );
        } else {
            setFileUploaded(false);
        }
  };
  const handleSave = async () => {
    if(!fileUploaded) {
      alert('Please upload a file')
      return
    }
    try {
      const docRef = await addDoc(collection(db, "blogs"), {
        audio: fileUrl,
        description: content,
        authorAvatar: '',
        authorName: '',
        cover: '',
        duration:'',
        title: '',
      });
      console.log("Document written with ID: ", docRef.id);
      alert('Document written')
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <>
      <h1 className='text-5xl text-center p-6 mt-3'>Admin Page</h1>
      <div className='flex mt-6 mx-9 justify-center flex-col'>
        <Editors value={content} setValue={setContent}/>
        <input type='file' className='mt-7 w-80 h-10 border-2 border-gray-300 rounded-md p-2' onChange={handleFileUpload}/>
        {fileUploaded ? <p className='mt-3'>File Uploaded</p>:
        <div className='mt-2'>
          <p>File Upload Progress: {progress}%</p>
          </div>
        }
        <button className='bg-blue-500 hover:bg-blue-700 mt-7 w-40 text-white font-bold py-2 px-4 rounded' onClick={handleSave}>Save</button> 
      </div>
    </> 
  )
}

export default Admin 
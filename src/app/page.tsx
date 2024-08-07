"use client"
import { title } from 'process';
import React, { useState } from 'react'
import { RiseLoader } from 'react-spinners';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API;

const page = () => {

  const [videoData, setVideoData] = useState({
    videoTopic: '',
    videoKeywords: '',
  })
  const [result, setResult] = useState({
    title: '',
    description: '',
    hashtags: []
  })

  const [isLoading, setIsLoading] = useState(false);


  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setVideoData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const trainingPrompt = [
    {
      "parts": [{
        "text": `
        I want you to act as a bot that provides a YouTube video title, description, and hashtags in JSON format.
  
        I will provide you with the video topic and video keywords. 
  
        Your response should always be in the following JSON format:
  
        {
          "title": "example title",
          "description": "example description",
          "hashtags": ["#example1", "#example2"]
        }
  
        Do you understand? Respond with 'yes' if you understand.
        `
      }],
      "role": 'user'
    },
    {
      "parts": [
        {
          "text": "yes"
        }
      ],
      "role": "model"
    }
  ];


  const submitData = async () => {
    let url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY

    let messageToSend = [
      ...trainingPrompt,
      {
        "parts": [{
          "text": JSON.stringify(videoData)
        }
        ],
        "role": "user"
      }
    ]

    setIsLoading(true)
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "contents": messageToSend
      })
    })

    let resjson = await res.json()
    setIsLoading(false)


    let responseMessage = resjson.candidates[0].content.parts[0].text
    responseMessage = JSON.parse(responseMessage);

    setResult({
      title: responseMessage.title,
      description: responseMessage.description,
      hashtags: responseMessage.hashtags
    });

    // console.log({
    //   title: responseMessage.title,
    //   description: responseMessage.description,
    //   hashtags: responseMessage.hashtags
    // })
  }

  return (
    <div className='main'>
      <p className='logo'>Gfg AI</p>
      <h1>Youtube Title Description Generator</h1>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam aperiam ratione repellendus inventore eligendi deleniti autem, vitae tempore voluptatum doloribus?</p>

      {
        result.title?.length > 0 ?

          <div>
            <div className='inputContainer'>
              <label>Generated Video Title</label>
              <input
                placeholder='Generated video title'
                value={result.title}
                readOnly
              />
            </div>

            <div className='inputContainer'>
              <label>Generated Video Description</label>
              <textarea
                placeholder='Generated video description'
                value={result.description}
                readOnly
              />
            </div>

            <div className='inputContainer'>
              <label>Generated Hashtags</label>
              <input
                placeholder='Generated hashtags'
                value={result.hashtags.join(', ')}
                readOnly
              />
            </div>

            <button
              onClick={() => {
                setResult({
                  title: '',
                  description: '',
                  hashtags: []
                })
              }}
            >Reset
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
              </svg>
            </button>
          </div>
          :
          <div>
            <div className='inputContainer'>
              <label>Video Topic</label>
              <input
                name='videoTopic'
                placeholder='eq. Introduction to React JS for beginners.'
                value={videoData.videoTopic}
                onChange={handleInputChange}
              />
            </div>

            <div className='inputContainer'>
              <label>Keywords</label>
              <input
                name='videoKeywords'
                placeholder='eq. coding, development , reactjs, html ,css'
                value={videoData.videoKeywords}
                onChange={handleInputChange}
              />
            </div>

            {
              isLoading ?
                <button>
                  <RiseLoader color='#ffffff' />
                </button>
                :
                <button
                  onClick={() => {
                    submitData()
                  }}
                >Generate
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                  </svg>
                </button>
            }
          </div>

      }


    </div>
  )
}

export default page
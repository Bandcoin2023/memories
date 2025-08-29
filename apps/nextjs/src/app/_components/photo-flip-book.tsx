"use client"

import { useState, useEffect } from "react"
import HTMLFlipBook from 'react-pageflip';

interface PhotoFlipBookProps {
    images: string[]
    title?: string
    subtitle?: string
    coverImage?: string
}

export default function PhotoFlipBook({
    images,
    title = "Photo Album",
    subtitle = "Memories Collection",
    coverImage,
}: PhotoFlipBookProps) {
    const [dimensions, setDimensions] = useState({ width: 300, height: 400 })

    useEffect(() => {
        const updateDimensions = () => {
            if (window.innerWidth < 640) {
                // Mobile
                setDimensions({ width: 150, height: 240 })
            } else if (window.innerWidth < 1024) {
                // Tablet
                setDimensions({ width: 280, height: 420 })
            } else {
                // Desktop
                setDimensions({ width: 320, height: 450 })
            }
        }

        updateDimensions()
        window.addEventListener("resize", updateDimensions)
        return () => window.removeEventListener("resize", updateDimensions)
    }, [])

    return (
        <div className="flex justify-center items-center p-2 sm:p-4 h-full w-full">
            <HTMLFlipBook
                width={dimensions.width}
                height={dimensions.height}
                maxShadowOpacity={0.5}
                drawShadow={true}
                showCover={true}
                size="stretch"
                minWidth={dimensions.width}
                maxWidth={dimensions.width}
                minHeight={dimensions.height}
                maxHeight={dimensions.height}
                flippingTime={600}
                usePortrait={false}
                startZIndex={0}
                autoSize={false}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                className="shadow-lg relative"
                style={{

                }}
                startPage={0}
                mobileScrollSupport={true}
            >
                {/* Cover Page */}
                <div className=" bg-gradient-to-br from-red-500 to-red-700  " style={{

                }} >
                    <div className="w-full h-full flex flex-col justify-center items-center p-3 sm:p-4 lg:p-6 text-center text-white  ">
                        {coverImage ? (
                            <div className="flex-1 flex items-center justify-center mb-3 sm:mb-4">
                                <img
                                    src={coverImage || "/placeholder.svg"}
                                    alt="Cover"
                                    className="w-full h-full  shadow-lg object-cover mx-auto"
                                />
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center mb-3 sm:mb-4">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/20 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}
                        <div className="flex-shrink-0">
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 drop-shadow-lg text-balance leading-tight">
                                {title}
                            </h1>
                            <p className="text-xs sm:text-sm lg:text-base opacity-90 drop-shadow text-balance">{subtitle}</p>
                        </div>
                    </div>
                </div>

                {/* Photo Pages */}
                {images.map((image, index) => (
                    <div key={index} className="p-[0.1rem]">
                        <div className=" flex flex-col justify-center items-center  h-full">
                            <div className="w-full h-full  rounded-md  shadow-md overflow-hidden">
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                                <div className="p-3 sm:p-4 text-center">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">Memory {index + 1}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        Page {index + 1} of {images.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Back Cover */}
                <div className="page bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg">
                    <div className="w-full h-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 text-center text-white">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                            <svg
                                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">The End</h2>
                        <p className="text-sm sm:text-base text-gray-300">Thank you for viewing our memories</p>
                    </div>
                </div>
            </HTMLFlipBook>
        </div>
    )
}

import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import TaskSection from './TaskSection'
import GroupProfileModal from './GroupProfileModal'

const RightSidebar = () => {

    const {selectedUser, messages} = useContext(ChatContext)
    const {logout, onlineUsers, authUser} = useContext(AuthContext)
    const [msgImages, setMsgImages] = useState([])
    const [activeTab, setActiveTab] = useState('profile')
    const [showGroupProfileModal, setShowGroupProfileModal] = useState(false)

    // Get all the images from the messages and set them to state
    useEffect(()=>{
        setMsgImages(
            messages.filter(msg => msg.image).map(msg=>msg.image)
        )
    },[messages])

    const displayUser = selectedUser || authUser;
    const isOwnProfile = !selectedUser;

  return displayUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-hidden ${selectedUser ? "max-md:hidden" : ""}`}>
        
        {/* Tab Navigation */}
        <div className='flex border-b border-[#ffffff30] pt-4'>
            <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 text-sm ${activeTab === 'profile' ? 'border-b-2 border-white text-white' : 'text-gray-400'}`}
            >
                Profile
            </button>
            <button 
                onClick={() => setActiveTab('tasks')}
                className={`flex-1 py-2 text-sm ${activeTab === 'tasks' ? 'border-b-2 border-white text-white' : 'text-gray-400'}`}
            >
                Tasks
            </button>
        </div>

        {/* Tab Content */}
        <div className='flex-1 overflow-y-scroll pb-4'>
            {activeTab === 'profile' && (
                <div>
                    <div className='pt-8 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
            {displayUser.isGroup ? (
                <div className='relative'>
                    {displayUser.profilePic ? (
                        <img src={displayUser.profilePic} alt="" className='w-20 aspect-[1/1] rounded-full object-cover' />
                    ) : (
                        <div className='w-20 h-20 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-2xl'>
                            {displayUser.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    {displayUser.admin === authUser._id && (
                        <button 
                            onClick={() => setShowGroupProfileModal(true)}
                            className='absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 text-xs hover:bg-blue-600'
                            title='Update group photo'
                        >
                            ✏️
                        </button>
                    )}
                </div>
            ) : (
                <img src={displayUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
            )}
            <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
                {displayUser.isGroup ? (
                    <span>{displayUser.name}</span>
                ) : (
                    <>
                        {!isOwnProfile && onlineUsers.includes(displayUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
                        {isOwnProfile && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
                        {displayUser.fullName}
                        {isOwnProfile && <span className='text-sm text-gray-400'>(You)</span>}
                    </>
                )}
            </h1>
            <p className='px-10 mx-auto text-center'>
                {displayUser.isGroup ? displayUser.description || 'No description' : displayUser.bio}
            </p>
            {displayUser.isGroup && (
                <div className='px-10 mx-auto text-center mt-2'>
                    <p className='text-gray-400 text-xs'>{displayUser.members?.length || 0} members</p>
                    <div className='mt-2 text-xs'>
                        <p className='text-gray-300 mb-1'>Members:</p>
                        <div className='text-gray-400'>
                            {displayUser.members?.map(member => member.fullName).join(', ')}
                        </div>
                    </div>
                </div>
            )}
        </div>

        <hr className="border-[#ffffff50] my-4"/>

        {selectedUser && !selectedUser.isGroup && (
            <div className="px-5 text-xs">
                <p>Media</p>
                <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
                    {msgImages.map((url, index)=>(
                        <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
                            <img src={url} alt="" className='h-full rounded-md'/>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {selectedUser && selectedUser.isGroup && (
            <div className="px-5 text-xs">
                <p>Group Media</p>
                <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
                    {msgImages.map((url, index)=>(
                        <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
                            <img src={url} alt="" className='h-full rounded-md'/>
                        </div>
                    ))}
                </div>
            </div>
        )}
                
                {isOwnProfile && (
                    <div className="px-5 text-xs mt-4 mb-6">
                        <p className='mb-2'>Your Profile</p>
                        <div className='space-y-2 text-gray-300'>
                            <p><span className='text-white'>Email:</span> {authUser.email}</p>
                            <p><span className='text-white'>Member since:</span> {new Date(authUser.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
                </div>
            )}
            
            {activeTab === 'tasks' && (
                <TaskSection />
            )}
        </div>

        
        <GroupProfileModal 
            isOpen={showGroupProfileModal}
            onClose={() => setShowGroupProfileModal(false)}
            group={selectedUser}
            onUpdate={() => {
                // Refresh the selected user data
                window.location.reload();
            }}
        />
    </div>
  )
}

export default RightSidebar

import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import CreateGroupModal from './CreateGroupModal';

const Sidebar = () => {

    const {getUsers, users, selectedUser, setSelectedUser,
        unseenMessages, setUnseenMessages, unseenGroupMessages, setUnseenGroupMessages } = useContext(ChatContext);

    const {logout, onlineUsers, axios} = useContext(AuthContext)

    const [input, setInput] = useState(false)
    const [showGroups, setShowGroups] = useState(false)
    const [groups, setGroups] = useState([])
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)

    const navigate = useNavigate();

    const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    const getGroups = async () => {
        try {
            const { data } = await axios.get("/api/groups");
            if (data.success) {
                setGroups(data.groups);
                // Initialize unseen group messages if not already set
                const initialUnseenGroups = {};
                data.groups.forEach(group => {
                    if (!(group._id in unseenGroupMessages)) {
                        initialUnseenGroups[group._id] = 0;
                    }
                });
                if (Object.keys(initialUnseenGroups).length > 0) {
                    setUnseenGroupMessages(prev => ({...prev, ...initialUnseenGroups}));
                }
            }
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        }
    };

    useEffect(()=>{
        getUsers();
        getGroups();
    },[onlineUsers])

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
            <img src={assets.logo_icon} alt="logo" className='max-w-8' />
            <p className='font-bold'>NEXTALK</p>
            <div className="relative py-2 group">
                <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
                <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
                    <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
                    <hr className="my-2 border-t border-gray-500" />
                    <p onClick={()=> logout()} className='cursor-pointer text-sm'>Logout</p>
                </div>
            </div>
        </div>

        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
            <img src={assets.search_icon} alt="Search" className='w-3'/>
            <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search...'/>
        </div>

        <div className='flex gap-2 mt-3'>
            <button 
                onClick={() => setShowGroups(false)}
                className={`relative flex-1 py-2 px-3 rounded text-xs ${!showGroups ? 'bg-violet-500' : 'bg-gray-600'}`}
            >
                Users
                {Object.values(unseenMessages).reduce((total, count) => total + count, 0) > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center'>
                        {Object.values(unseenMessages).reduce((total, count) => total + count, 0)}
                    </span>
                )}
            </button>
            <button 
                onClick={() => setShowGroups(true)}
                className={`relative flex-1 py-2 px-3 rounded text-xs ${showGroups ? 'bg-violet-500' : 'bg-gray-600'}`}
            >
                Groups
                {Object.values(unseenGroupMessages).reduce((total, count) => total + count, 0) > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center'>
                        {Object.values(unseenGroupMessages).reduce((total, count) => total + count, 0)}
                    </span>
                )}
            </button>
        </div>

        {showGroups && (
            <button 
                onClick={() => setIsCreateGroupOpen(true)}
                className='w-full mt-2 py-2 px-3 bg-green-600 hover:bg-green-700 rounded text-xs'
            >
                + Create Group
            </button>
        )}

      </div>

    <div className='flex flex-col'>
        {!showGroups ? (
            filteredUsers.map((user, index)=>(
                <div onClick={()=> {setSelectedUser(user); setUnseenMessages(prev=> ({...prev, [user._id]:0}))}}
                 key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
                    <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full'/>
                    <div className='flex flex-col leading-5'>
                        <p>{user.fullName}</p>
                        {
                            onlineUsers.includes(user._id)
                            ? <span className='text-green-400 text-xs'>Online</span>
                            : <span className='text-neutral-400 text-xs'>Offline</span>
                        }
                    </div>
                    {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
                </div>
            ))
        ) : (
            groups.map((group, index) => (
                <div 
                    key={index} 
                    onClick={() => {
                        setSelectedUser({...group, isGroup: true});
                        setUnseenGroupMessages(prev => ({...prev, [group._id]: 0}));
                    }}
                    className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === group._id && 'bg-[#282142]/50'}`}
                >
                    {group.profilePic ? (
                        <img src={group.profilePic} alt="" className='w-[35px] h-[35px] rounded-full object-cover' />
                    ) : (
                        <div className='w-[35px] h-[35px] bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm'>
                            {group.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className='flex flex-col leading-5'>
                        <p>{group.name}</p>
                        <span className='text-gray-400 text-xs'>{group.members.length} members</span>
                    </div>
                    {unseenGroupMessages[group._id] > 0 && (
                        <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>
                            {unseenGroupMessages[group._id]}
                        </p>
                    )}
                </div>
            ))
        )}
    </div>

    <CreateGroupModal 
        isOpen={isCreateGroupOpen} 
        onClose={() => {
            setIsCreateGroupOpen(false);
            getGroups(); // Refresh groups list
        }} 
    />

    </div>
  )
}

export default Sidebar

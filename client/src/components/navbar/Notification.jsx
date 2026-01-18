import React from 'react'
import { useState } from 'react'
import notification from '../../assets/icons/notification.svg'
import UserUrl from '../../assets/user.png'
const Notification = () => {

    const [dropflag, setdropflag] = useState(false)
  return (
   <>
<button onClick={()=>{setdropflag(!dropflag)}} onBlur={()=>{setdropflag(false)}} id="dropdownNotificationButton" data-dropdown-toggle="dropdownNotification" className="relative inline-flex items-center text-sm font-medium text-center text-body cursor-pointer hover:text-heading focus:outline-none" type="button">
  <img className='w-[35px] h-[35px]' src={notification} alt='notifications' title='Notification'/>

<div className="absolute block w-3 h-3 bg-red-500 border-2 border-red-500 rounded-full top-0 left-[70%] start-3"></div>
</button>

{/* <!-- Dropdown menu --> */}
<div onMouseDown={(e) => e.preventDefault()} id="dropdownNotification" className={`z-20 ${dropflag?'':'hidden'} w-full max-w-sm bg-white divide-y divide-default-medium rounded-lg shadow absolute top-[100px] right-2 border border-default-medium`} aria-labelledby="dropdownNotificationButton">
  <div className="block px-4 py-2 font-medium text-center text-body rounded-t-base bg-neutral-secondary-medium">
      Notifications
  </div>
  <div className="divide-y divide-default">
    <a href="#" className="flex px-4 py-3 hover:bg-neutral-secondary-medium">
      <div className="shrink-0">
        <img className="rounded-full w-11 h-11" src={UserUrl} alt="Jese image" />
        
      </div>
      <div className="w-full ps-3">
          <div className="text-body text-sm mb-1.5">New message from <span className="font-semibold text-heading">Jese Leos</span>: "Hey, what's up? All set for the presentation?"</div>
          <div className="text-xs text-fg-brand">a few moments ago</div>
      </div>
    </a>
    <a href="#" className="flex px-4 py-3 hover:bg-neutral-secondary-medium">
      <div className="shrink-0">
        <img className="rounded-full w-11 h-11" src={UserUrl} alt="Joseph image" />
      </div>
      <div className="w-full ps-3">
          <div className="text-body text-sm mb-1.5"><span className="font-semibold text-heading">Joseph Mcfall</span> and <span className="font-medium text-heading">5 others</span> started following you.</div>
          <div className="text-xs text-fg-brand">10 minutes ago</div>
      </div>
    </a>
    <a href="#" className="flex px-4 py-3 hover:bg-neutral-secondary-medium">
      <div className="shrink-0">
        <img className="rounded-full w-11 h-11" src={UserUrl} alt="Bonnie image" />
      </div>
      <div className="w-full ps-3">
          <div className="text-body text-sm mb-1.5"><span className="font-semibold text-heading">Bonnie Green</span> and <span className="font-medium text-heading">141 others</span> love your story. See it and view more stories.</div>
          <div className="text-xs text-fg-brand">44 minutes ago</div>
      </div>
    </a>
    <a href="#" className="flex px-4 py-3 hover:bg-neutral-secondary-medium">
      <div className="shrink-0">
        <img className="rounded-full w-11 h-11" src={UserUrl} alt="Leslie image" />
      </div>
      <div className="w-full ps-3">
          <div className="text-body text-sm mb-1.5"><span className="font-semibold text-heading">Leslie Livingston</span> mentioned you in a comment: <span className="font-medium text-fg-brand" href="#">@bonnie.green</span> what do you say?</div>
          <div className="text-xs text-fg-brand">1 hour ago</div>
      </div>
    </a>
    <a href="#" className="flex px-4 py-3 hover:bg-neutral-secondary-medium">
      <div className="shrink-0">
        <img className="rounded-full w-11 h-11" src={UserUrl} alt="Robert image" />
      </div>
      <div className="w-full ps-3">
          <div className="text-body text-sm mb-1.5"><span className="font-semibold text-heading">Robert Brown</span> posted a new video: Glassmorphism - learn how to implement the new design trend.</div>
          <div className="text-xs text-fg-brand">3 hours ago</div>
      </div>
    </a>
  </div>
  <a href="#" className="block py-2 font-medium text-center text-body rounded-b-base bg-neutral-secondary-medium hover:bg-neutral-tertiary-medium">
    <div className="inline-flex items-center ">
      <svg className="w-5 h-5 me-1.5 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/><path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
        View all
    </div>
  </a>
</div>

   </>
  )
}

export default Notification

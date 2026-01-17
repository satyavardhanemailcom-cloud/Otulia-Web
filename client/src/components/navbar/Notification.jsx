import React from 'react'
import { useState } from 'react'
import notification from '../../assets/icons/notification.svg'
const Notification = () => {

    const [dropflag, setdropflag] = useState(false)
  return (
   <>
<button onClick={()=>{setdropflag(!dropflag)}} onBlur={()=>{setdropflag(false)}} id="dropdownNotificationButton" data-dropdown-toggle="dropdownNotification" className="relative inline-flex items-center text-sm font-medium text-center text-body cursor-pointer hover:text-heading focus:outline-none" type="button">
  <img className='w-[35px] h-[35px]' src={notification} alt='notifications' title='Notification'/>

<div className="absolute block w-3 h-3 bg-red-500 border-2 border-red-500 rounded-full top-0 left-[70%] start-3"></div>
</button>

{/* <!-- Dropdown menu --> */}
<div onMouseDown={(e) => e.preventDefault()} id="dropdownNotification" className={`z-20 ${dropflag?'':'hidden'} w-full max-w-sm bg-neutral-primary-soft divide-y divide-default-medium rounded-base shadow absolute top-[100px] right-2`} aria-labelledby="dropdownNotificationButton">
  <div className="block px-4 py-2 font-medium text-center text-body rounded-t-base bg-neutral-secondary-medium">
      Notifications
  </div>
  <div className="divide-y divide-default">
    <a href="#" className="flex px-4 py-3 hover:bg-neutral-secondary-medium">
      <div className="shrink-0">
        <img className="rounded-full w-11 h-11" src="/docs/images/people/profile-picture-1.jpg" alt="Jese image" />
        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-brand border border-buffer-medium rounded-full">
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M5.024 3.783A1 1 0 0 1 6 3h12a1 1 0 0 1 .976.783L20.802 12h-4.244a1.99 1.99 0 0 0-1.824 1.205 2.978 2.978 0 0 1-5.468 0A1.991 1.991 0 0 0 7.442 12H3.198l1.826-8.217ZM3 14v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5h-4.43a4.978 4.978 0 0 1-9.14 0H3Zm5-7a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm0 2a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H8Z" clipRule="evenodd"/></svg>
        </div>
      </div>
      <div className="w-full ps-3">
          <div className="text-body text-sm mb-1.5">New message from <span className="font-semibold text-heading">Jese Leos</span>: "Hey, what's up? All set for the presentation?"</div>
          <div className="text-xs text-fg-brand">a few moments ago</div>
      </div>
    </a>
    <a href="#" className="flex px-4 py-3 hover:bg-neutral-secondary-medium">
      <div className="shrink-0">
        <img className="rounded-full w-11 h-11" src="/docs/images/people/profile-picture-2.jpg" alt="Joseph image" />
        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-dark border border-buffer-medium rounded-full">
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clipRule="evenodd"/></svg>
        </div>
      </div>
      <div className="w-full ps-3">
          <div className="text-body text-sm mb-1.5"><span className="font-semibold text-heading">Joseph Mcfall</span> and <span className="font-medium text-heading">5 others</span> started following you.</div>
          <div className="text-xs text-fg-brand">10 minutes ago</div>
      </div>
    </a>
    <a href="#" className="flex px-4 py-3 hover:bg-neutral-secondary-medium">
      <div className="shrink-0">
        <img className="rounded-full w-11 h-11" src="/docs/images/people/profile-picture-3.jpg" alt="Bonnie image" />
        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-danger border border-buffer-medium rounded-full">
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z"/></svg>
        </div>
      </div>
      <div className="w-full ps-3">
          <div className="text-body text-sm mb-1.5"><span className="font-semibold text-heading">Bonnie Green</span> and <span className="font-medium text-heading">141 others</span> love your story. See it and view more stories.</div>
          <div className="text-xs text-fg-brand">44 minutes ago</div>
      </div>
    </a>
    <a href="#" className="flex px-4 py-3 hover:bg-neutral-secondary-medium">
      <div className="shrink-0">
        <img className="rounded-full w-11 h-11" src="/docs/images/people/profile-picture-4.jpg" alt="Leslie image" />
        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-success border border-buffer-medium rounded-full">
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6.616l-2.88 2.592C8.537 20.461 7 19.776 7 18.477V17H5a2 2 0 0 1-2-2V6Zm4 2a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2H7Zm8 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Zm-8 3a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Zm5 0a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2h-5Z" clipRule="evenodd"/></svg>
        </div>
      </div>
      <div className="w-full ps-3">
          <div className="text-body text-sm mb-1.5"><span className="font-semibold text-heading">Leslie Livingston</span> mentioned you in a comment: <span className="font-medium text-fg-brand" href="#">@bonnie.green</span> what do you say?</div>
          <div className="text-xs text-fg-brand">1 hour ago</div>
      </div>
    </a>
    <a href="#" className="flex px-4 py-3 hover:bg-neutral-secondary-medium">
      <div className="shrink-0">
        <img className="rounded-full w-11 h-11" src="/docs/images/people/profile-picture-5.jpg" alt="Robert image" />
        <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-purple border border-buffer-medium rounded-full">
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M14 7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7Zm2 9.387 4.684 1.562A1 1 0 0 0 22 17V7a1 1 0 0 0-1.316-.949L16 7.613v8.774Z" clipRule="evenodd"/></svg>
        </div>
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

import React from 'react'
import { useState } from 'react'
import UserUrl from '../../assets/user.png'

const Profile_dropdown = () => {

    const [dropflag, setdropflag] = useState(false)

  return (
    <>
<button onClick={()=>{setdropflag(!dropflag)}} onBlur={()=>{setdropflag(false)}} id="dropdownUserAvatarButton" data-dropdown-toggle="dropdownAvatar" className="flex text-sm bg-dark rounded-full cursor-pointer" type="button">
  <span className="sr-only">Open user menu</span>
  <img className="w-8 h-8 rounded-full" src={UserUrl} alt="user photo" />
</button>

{/* <!-- Dropdown menu --> */}
<div onMouseDown={(e) => e.preventDefault()} id="dropdownAvatar" className={`z-10 ${dropflag?'':'hidden'} bg-white right-2 border border-default-medium rounded-lg shadow-lg w-72 absolute top-[100px]`}>
    <div className="p-2">
      <div className="flex items-center px-2.5 p-2 space-x-1.5 text-sm bg-neutral-secondary-strong rounded">
        <img className="w-8 h-8 rounded-full" src={UserUrl} alt="Rounded avatar" />
        <div className="text-sm">
          <div className="font-medium text-heading">Joseph McFall</div>
          <div className="truncate text-body">name@flowbite.com</div>
        </div>
        <span className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded ms-auto">PRO</span>
      </div>
    </div>
    <ul className="px-2 pb-2 text-sm text-body font-medium" aria-labelledby="dropdownAvatarButton">
      <li>
        <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
          <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
          Account
        </a>
      </li>
      <li>
        <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
          <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4"/></svg>
          Settings
        </a>
      </li>
      <li>
        <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
          <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"/></svg>
          Privacy
        </a>
      </li>
      <li>
        <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
          <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"/></svg>
          Notifications
        </a>
      </li>
      <li>
        <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
          <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
          Help center
        </a>
      </li>
      <li className="flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded mb-1.5">
        <a href="#" className="inline-flex items-center">
          <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"/></svg>
          Dark mode
        </a>
        <label className="inline-flex items-center cursor-pointer ms-auto">
          <input type="checkbox" value="" className="sr-only peer" />
          <div className="relative w-9 h-5 bg-neutral-quaternary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
          <span className="ms-3 text-sm font-medium text-heading sr-only">Toggle me</span>
        </label>
      </li>
      <li className="border-t border-default-medium pt-1.5">
        <a href="#" className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">
          <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10.051 8.102-3.778.322-1.994 1.994a.94.94 0 0 0 .533 1.6l2.698.316m8.39 1.617-.322 3.78-1.994 1.994a.94.94 0 0 1-1.595-.533l-.4-2.652m8.166-11.174a1.366 1.366 0 0 0-1.12-1.12c-1.616-.279-4.906-.623-6.38.853-1.671 1.672-5.211 8.015-6.31 10.023a.932.932 0 0 0 .162 1.111l.828.835.833.832a.932.932 0 0 0 1.111.163c2.008-1.102 8.35-4.642 10.021-6.312 1.475-1.478 1.133-4.77.855-6.385Zm-2.961 3.722a1.88 1.88 0 1 1-3.76 0 1.88 1.88 0 0 1 3.76 0Z"/></svg>
          Upgrade to PRO
        </a>
      </li>
      <li>
        <a href="#" className="inline-flex items-center w-full p-2 text-fg-danger hover:bg-neutral-tertiary-medium rounded">
          <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/></svg>
          Sign out
        </a>
      </li>
    </ul>
</div>


    </>
  )
}

export default Profile_dropdown

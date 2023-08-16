import { useState } from 'react'
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <section id="login">
    <div class="container h-[100vh]">
        <div class="pt-8">
            
            <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                
                <div class="px-4 py-8 bg-white shadow rounded-lg sm:px-10">
                    <div class="flex justify-center mb-5">
                        <img src="logosmansara.png" alt="SMAN 1 Jepara" class="text-center w-52"/>
                    </div>
                    <hr/>
                    <form action="{{route('login')}}" method="POST">
                        
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700 leading-5">
                                Username
                            </label>

                            <div class="mt-1 rounded-md shadow-sm">
                                <input id="username" name="username" type="text" required autofocus class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                            </div>

                        </div>

                        <div class="mt-6">
                            <label for="password" class="block text-sm font-medium text-gray-700 leading-5">
                                Password
                            </label>

                            <div class="mt-1 rounded-md shadow-sm">
                                <input id="password" name="password" type="password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                            </div>

                        </div>

                        <div class="mt-6">
                            <span class="block w-full rounded-md shadow-sm">
                                <button type="submit" class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                                    Sign in
                                </button>
                            </span>
                        </div>
                        {/* @if ($errors->any())
                            <span class="text-center text-red-600">{{$errors->first()}}</span>
                        @endif */}
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
  )
}

export default App

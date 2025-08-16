export default function BubbleBackground() {

    return (
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
            <defs>

                <radialGradient id="bubble1" cx="30%" cy="30%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="70%" stop-color="#ffb3d9" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#ffc1e3" stop-opacity="0.4"/>
                </radialGradient>

                <radialGradient id="bubble2" cx="30%" cy="30%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="70%" stop-color="#b3e5fc" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#c8f0ff" stop-opacity="0.4"/>
                </radialGradient>

                <radialGradient id="bubble3" cx="30%" cy="30%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="70%" stop-color="#fff9c4" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#fffacd" stop-opacity="0.4"/>
                </radialGradient>

                <radialGradient id="bubble4" cx="30%" cy="30%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="70%" stop-color="#d1c4e9" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#e1d5f0" stop-opacity="0.4"/>
                </radialGradient>

                <radialGradient id="bubble5" cx="30%" cy="30%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="70%" stop-color="#c8e6c9" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#dcedc8" stop-opacity="0.4"/>
                </radialGradient>

                <radialGradient id="bubble6" cx="30%" cy="30%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="70%" stop-color="#ffe0b2" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#ffecb3" stop-opacity="0.4"/>
                </radialGradient>

                <radialGradient id="bubble7" cx="30%" cy="30%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="70%" stop-color="#f8bbd9" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#fce4ec" stop-opacity="0.4"/>
                </radialGradient>

                <radialGradient id="bubble8" cx="30%" cy="30%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="70%" stop-color="#b3e0ff" stop-opacity="0.6"/>
                    <stop offset="100%" stop-color="#cce7ff" stop-opacity="0.4"/>
                </radialGradient>
            </defs>


            <rect width="100%" height="100%" fill="#ffffff" fill-opacity="0"/>

            <defs>
                <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1"/>
                    <stop offset="100%" stop-color="#f8f9ff" stop-opacity="0.2"/>
                </linearGradient>
            </defs>


            <circle cx="150" cy="120" r="85" fill="url(#bubble1)" opacity="0.3"/>
            <circle cx="650" cy="180" r="75" fill="url(#bubble2)" opacity="0.35"/>
            <circle cx="400" cy="450" r="95" fill="url(#bubble3)" opacity="0.28"/>
            <circle cx="720" cy="480" r="70" fill="url(#bubble4)" opacity="0.32"/>


            <circle cx="300" cy="200" r="50" fill="url(#bubble5)" opacity="0.4"/>
            <circle cx="550" cy="350" r="45" fill="url(#bubble6)" opacity="0.38"/>
            <circle cx="100" cy="380" r="55" fill="url(#bubble7)" opacity="0.35"/>
            <circle cx="600" cy="90" r="40" fill="url(#bubble8)" opacity="0.42"/>
            <circle cx="250" cy="500" r="48" fill="url(#bubble1)" opacity="0.36"/>
            <circle cx="480" cy="150" r="42" fill="url(#bubble2)" opacity="0.4"/>


            <circle cx="80" cy="250" r="25" fill="url(#bubble3)" opacity="0.5"/>
            <circle cx="380" cy="80" r="30" fill="url(#bubble4)" opacity="0.45"/>
            <circle cx="200" cy="350" r="28" fill="url(#bubble5)" opacity="0.42"/>
            <circle cx="520" cy="280" r="22" fill="url(#bubble6)" opacity="0.55"/>
            <circle cx="680" cy="320" r="32" fill="url(#bubble7)" opacity="0.48"/>
            <circle cx="120" cy="500" r="26" fill="url(#bubble8)" opacity="0.44"/>
            <circle cx="450" cy="520" r="24" fill="url(#bubble1)" opacity="0.52"/>
            <circle cx="750" cy="120" r="28" fill="url(#bubble2)" opacity="0.46"/>
            <circle cx="320" cy="380" r="20" fill="url(#bubble3)" opacity="0.58"/>
            <circle cx="180" cy="280" r="18" fill="url(#bubble4)" opacity="0.54"/>


            <circle cx="60" cy="180" r="12" fill="url(#bubble5)" opacity="0.6"/>
            <circle cx="220" cy="150" r="15" fill="url(#bubble6)" opacity="0.55"/>
            <circle cx="360" cy="250" r="10" fill="url(#bubble7)" opacity="0.65"/>
            <circle cx="580" cy="200" r="14" fill="url(#bubble8)" opacity="0.58"/>
            <circle cx="420" cy="320" r="11" fill="url(#bubble1)" opacity="0.62"/>
            <circle cx="280" cy="420" r="13" fill="url(#bubble2)" opacity="0.6"/>
            <circle cx="620" cy="420" r="16" fill="url(#bubble3)" opacity="0.56"/>
            <circle cx="160" cy="450" r="12" fill="url(#bubble4)" opacity="0.64"/>
            <circle cx="500" cy="480" r="9" fill="url(#bubble5)" opacity="0.68"/>
            <circle cx="340" cy="520" r="11" fill="url(#bubble6)" opacity="0.62"/>
            <circle cx="700" cy="250" r="14" fill="url(#bubble7)" opacity="0.58"/>
            <circle cx="40" cy="320" r="10" fill="url(#bubble8)" opacity="0.66"/>
            <circle cx="260" cy="320" r="8" fill="url(#bubble1)" opacity="0.7"/>
            <circle cx="540" cy="120" r="12" fill="url(#bubble2)" opacity="0.64"/>
            <circle cx="760" cy="380" r="10" fill="url(#bubble3)" opacity="0.68"/>


            <circle cx="90" cy="90" r="6" fill="url(#bubble4)" opacity="0.75"/>
            <circle cx="330" cy="120" r="7" fill="url(#bubble5)" opacity="0.72"/>
            <circle cx="470" cy="220" r="5" fill="url(#bubble6)" opacity="0.78"/>
            <circle cx="190" cy="480" r="8" fill="url(#bubble7)" opacity="0.7"/>
            <circle cx="560" cy="450" r="6" fill="url(#bubble8)" opacity="0.76"/>
            <circle cx="410" cy="380" r="7" fill="url(#bubble1)" opacity="0.74"/>
            <circle cx="650" cy="280" r="5" fill="url(#bubble2)" opacity="0.8"/>
            <circle cx="270" cy="180" r="6" fill="url(#bubble3)" opacity="0.73"/>
            <circle cx="510" cy="350" r="4" fill="url(#bubble4)" opacity="0.82"/>
            <circle cx="130" cy="400" r="7" fill="url(#bubble5)" opacity="0.71"/>
        </svg>
    )
}

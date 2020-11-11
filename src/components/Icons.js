import React from 'react';

const REM_UNIT = 16;

export const ChattingIcon = React.memo(({ width = 2.625, height = 1.875 }) => {
  const defaultWidth = 42;
  const defaultHeight = 30;

  return (
    <svg
      width={`${width}rem`}
      height={`${height}rem`}
      viewBox={`0 0 ${width * REM_UNIT} ${height * REM_UNIT}`}
      version="1.1"
    >
      <g
        id="Icon/LNB/chatting"
        stroke="none"
        strokeWidth="1"
        fill="none"
        transform={`scale(${(width * REM_UNIT) / defaultWidth}, ${
          (height * REM_UNIT) / defaultHeight
        })`}
        fillRule="evenodd"
      >
        <g id="Group" transform="translate(1.500000, 3.000000)">
          <path
            d="M13,0 C19.627417,0 25,5.29840533 25,11.8343195 C25,18.3702337 19.627417,23.6686391 13,23.6686391 C10.5849496,23.6686391 8.33652805,22.9650664 6.45398859,21.7544233 L0.979968011,23.6591739 C0.771313403,23.7317425 0.543336927,23.6214231 0.470768299,23.4127684 C0.433661685,23.3060768 0.443396334,23.1886697 0.497567824,23.0895463 L3.03981163,18.436965 C1.75178326,16.5509554 1,14.2792195 1,11.8343195 C1,5.29840533 6.372583,0 13,0 Z M10.0937854,12.2568047 C9.89878544,12.5930966 10.0177854,13.0201183 10.3587854,13.2104536 C11.7187854,13.9737673 13.2677854,14.3751479 14.8417854,14.3751479 C16.4117854,14.3751479 17.9607854,13.9737673 19.3187854,13.2134122 C19.6597854,13.0230769 19.7797854,12.595069 19.5867854,12.2597633 C19.3917854,11.9224852 18.9597854,11.8061144 18.6187854,11.9954635 C16.3247854,13.278501 13.3497854,13.2775148 11.0607854,11.9944773 C10.7187854,11.8011834 10.2857854,11.9205128 10.0937854,12.2568047 Z M12.0562854,8.87573964 C11.5702854,8.87573964 11.1732854,9.26627219 11.1732854,9.74556213 C11.1732854,10.2258383 11.5702854,10.6163708 12.0562854,10.6163708 C12.5432854,10.6163708 12.9392854,10.2258383 12.9392854,9.74556213 C12.9392854,9.26627219 12.5432854,8.87573964 12.0562854,8.87573964 Z M17.3287854,8.87573964 C16.8427854,8.87573964 16.4457854,9.26627219 16.4457854,9.74556213 C16.4457854,10.2258383 16.8427854,10.6163708 17.3287854,10.6163708 C17.8147854,10.6163708 18.2117854,10.2258383 18.2117854,9.74556213 C18.2117854,9.26627219 17.8147854,8.87573964 17.3287854,8.87573964 Z"
            id="Combined-Shape"
            fill="#FFFFFF"
          />
          <path
            d="M27.3604248,0 C33.7887847,0 39,5.25508799 39,11.7375676 C39,12.2138664 38.971867,12.6835392 38.9171853,13.1449882 C38.7401572,14.9518626 38.1526855,16.6360232 37.2510209,18.1040704 L37.053964,18.413896 L38.4286413,23.1659229 C38.4900308,23.3781358 38.3677642,23.5999342 38.1555514,23.6613237 C38.0639909,23.6878105 37.9659816,23.6807317 37.8791777,23.6413624 L33.6988565,21.7454089 C31.9403107,22.8947124 29.8597366,23.5842945 27.6162085,23.6204853 L27.4290053,23.6302666 C25.4666803,23.6302666 23.6188352,23.1368309 22.000759,22.2663048 C25.2147164,19.7968754 27.2862676,15.9146576 27.2862676,11.5485009 C27.2862676,7.35450902 25.3748649,3.60704357 22.3758306,1.13004977 C23.8853822,0.404921416 25.576011,0 27.3604248,0 Z"
            id="Combined-Shape"
            fill="#C4C6F9"
          />
        </g>
      </g>
    </svg>
  );
});

export const MailIcon = React.memo(({ width = 1.812, height = 1.937 }) => {
  const defaultWidth = 29;
  const defaultHeight = 31;

  return (
    <svg
      width={`${width}rem`}
      height={`${height}rem`}
      viewBox={`0 0 ${width * REM_UNIT} ${height * REM_UNIT}`}
      version="1.1"
    >
      <g
        id="Icon/LNB/mail"
        stroke="none"
        strokeWidth="1"
        fill="none"
        transform={`scale(${(width * REM_UNIT) / defaultWidth}, ${
          (height * REM_UNIT) / defaultHeight
        })`}
        fillRule="evenodd"
      >
        <g id="Group" transform="translate(0.500000, 4.000000)">
          <path
            d="M27.9950621,9.17549493 L28,9.38712551 L28,21.613466 C28,23.9552993 26.1937672,25.8835181 23.9464418,25.9949169 L23.7409624,26 L4.25903764,26 C1.98527069,26 0.11309634,24.1406586 0.0049353637,21.8251814 L0,21.613466 L0,9.38712551 C0,7.42599207 1.26712395,5.75382084 3.0002174,5.19739619 L2.9996679,9.957 L3.03740148,9.97823259 C3.03724875,9.97856828 3.03709621,9.97890402 3.03694387,9.97923981 L2.87083488,9.8839746 C2.39254225,9.60783222 1.78095185,9.77170738 1.50480947,10.25 C1.24839155,10.6941289 1.3713765,11.2531931 1.77320188,11.5518885 L1.87083488,11.6160254 L13.849426,18.5338433 C14.1336918,18.8099889 14.5625843,18.8955913 14.9358987,18.7370058 L15.0460254,18.6820508 L26.1311506,12.2820508 L26.2287836,12.2179139 C26.5971235,11.9441097 26.73116,11.4515235 26.5534344,11.0292349 L26.497176,10.9160254 L26.433039,10.8183924 C26.1592349,10.4500525 25.6666487,10.316016 25.2443601,10.4937416 L25.1311506,10.55 L25.0535921,10.5964297 C25.0519882,10.4811152 25.0312388,10.365284 24.9903454,10.2542574 L24.9928623,10.2253446 L24.9928623,10.2253446 L25,10 L25.0010623,5.1979255 C26.6703586,5.73472907 27.9077086,7.3071007 27.9950621,9.17549493 Z M23.5,5 L23.5,9.797 L23.3833336,9.87764947 L23.3838615,5 L23.5,5 Z M4.5,5.003 L4.62344788,5.00567715 L4.62344788,7.2716506 L4.61574195,7.66600312 L4.6152141,9.664245 L4.5,9.588 L4.5,5.003 Z"
            id="Combined-Shape"
            fill="#C4C6F9"
          />
          <path
            d="M20.5,-8.52651283e-14 C22.1568542,-8.55694875e-14 23.5,1.34314575 23.5,3 L23.5,11 C23.5,11.1847345 23.4749538,11.3636192 23.4280719,11.5334435 L14.5776679,16.642833 L4.4996679,10.823 L4.5,3 C4.5,1.34314575 5.84314575,-8.49607691e-14 7.5,-8.52651283e-14 L20.5,-8.52651283e-14 Z M17.5,8 L10.5,8 C9.94771525,8 9.5,8.44771525 9.5,9 C9.5,9.55228475 9.94771525,10 10.5,10 L10.5,10 L17.5,10 C18.0522847,10 18.5,9.55228475 18.5,9 C18.5,8.44771525 18.0522847,8 17.5,8 L17.5,8 Z M18.5,4 L9.5,4 C8.94771525,4 8.5,4.44771525 8.5,5 C8.5,5.55228475 8.94771525,6 9.5,6 L9.5,6 L18.5,6 C19.0522847,6 19.5,5.55228475 19.5,5 C19.5,4.44771525 19.0522847,4 18.5,4 L18.5,4 Z"
            id="Combined-Shape"
            fill="#FFFFFF"
          />
        </g>
      </g>
    </svg>
  );
});

export const PeopleIcon = React.memo(({ width = 2.062, height = 1.687 }) => {
  const defaultWidth = 33;
  const defaultHeight = 27;

  return (
    <svg
      width={`${width}rem`}
      height={`${height}rem`}
      viewBox={`0 0 ${width * REM_UNIT} ${height * REM_UNIT}`}
      version="1.1"
    >
      <g
        id="Icon/LNB/people_list"
        stroke="none"
        strokeWidth="1"
        fill="none"
        transform={`scale(${(width * REM_UNIT) / defaultWidth}, ${
          (height * REM_UNIT) / defaultHeight
        })`}
        fillRule="evenodd"
      >
        <g id="Group-2" transform="translate(0.000000, 2.000000)">
          <path
            d="M21.95,22.2 C27.8870611,22.2 32.7,17.3870611 32.7,11.45 C32.7,5.51293894 27.8870611,0.7 21.95,0.7 C16.0129389,0.7 11.2,5.51293894 11.2,11.45 C11.2,17.3870611 16.0129389,22.2 21.95,22.2 Z M17.7098,11.9961 C17.5358,12.3021 17.6428,12.6911 17.9488,12.8631 C19.1688,13.5571 20.5588,13.9231 21.9688,13.9231 C23.3788,13.9231 24.7678,13.5581 25.9868,12.8661 C26.2928,12.6931 26.4008,12.3041 26.2268,11.9981 C26.0528,11.6921 25.6648,11.5851 25.3588,11.7581 C23.2998,12.9251 20.6318,12.9241 18.5788,11.7571 C18.2708,11.5811 17.8828,11.6901 17.7098,11.9961 Z M19.5747,8.9202 C19.1377,8.9202 18.7827,9.2742 18.7827,9.7122 C18.7827,10.1492 19.1377,10.5032 19.5747,10.5032 C20.0117,10.5032 20.3657,10.1492 20.3657,9.7122 C20.3657,9.2742 20.0117,8.9202 19.5747,8.9202 Z M24.0991,8.9202 C23.6621,8.9202 23.3071,9.2742 23.3071,9.7122 C23.3071,10.1492 23.6621,10.5032 24.0991,10.5032 C24.5351,10.5032 24.8901,10.1492 24.8901,9.7122 C24.8901,9.2742 24.5351,8.9202 24.0991,8.9202 Z"
            id="Shape"
            fill="#FFFFFF"
          />
          <path
            d="M9.6167,15.9902 C10.3657,15.9902 10.9777,16.6032 10.9777,17.3522 L10.9777,17.8082 C10.9777,18.5562 10.3657,19.1692 9.6167,19.1692 L1.3617,19.1692 C0.6137,19.1692 0.0007,18.5562 0.0007,17.8082 L0.0007,17.3522 C0.0007,16.6032 0.6137,15.9902 1.3617,15.9902 L9.6167,15.9902 Z M6.812,10.083 C7.561,10.083 8.173,10.697 8.173,11.445 L8.173,11.901 C8.173,12.65 7.561,13.262 6.812,13.262 L1.362,13.262 C0.614,13.262 7.96696042e-13,12.65 7.96696042e-13,11.901 L7.96696042e-13,11.445 C7.96696042e-13,10.697 0.614,10.083 1.362,10.083 L6.812,10.083 Z M8.8227,4.1767 C9.5707,4.1767 10.1837,4.7897 10.1837,5.5387 L10.1837,5.9947 C10.1837,6.7427 9.5707,7.3557 8.8227,7.3557 L1.3617,7.3557 C0.6137,7.3557 0.000700000001,6.7427 0.000700000001,5.9947 L0.000700000001,5.5387 C0.000700000001,4.7897 0.6137,4.1767 1.3617,4.1767 L8.8227,4.1767 Z"
            id="Combined-Shape"
            fill="#C4C6F9"
          />
        </g>
      </g>
    </svg>
  );
});

export const SpaceIcon = React.memo(({ width = 1.25, height = 1.25 }) => {
  const defaultWidth = 20;
  const defaultHeight = 20;

  return (
    <svg
      width={`${width}rem`}
      height={`${height}rem`}
      viewBox={`0 0 ${width * REM_UNIT} ${height * REM_UNIT}`}
      version="1.1"
    >
      <g
        id="Icon/system/space"
        stroke="none"
        strokeWidth="1"
        fill="none"
        transform={`scale(${(width * REM_UNIT) / defaultWidth}, ${
          (height * REM_UNIT) / defaultHeight
        })`}
        fillRule="evenodd"
      >
        <path
          d="M18.3302439,1.15989486 C19.1016999,1.56220711 19.1297773,2.30402912 18.8009497,3.09300158 C18.1930588,4.55154454 17.5817953,5.73405954 16.5060482,7.2510173 C16.739757,7.9694937 16.8672003,8.73495105 16.8672003,9.52993822 C16.8672003,13.5822361 13.5558925,16.8672726 9.4711873,16.8672726 C8.61880818,16.8672726 7.80010711,16.7242238 7.03814584,16.4610049 L6.72478816,16.6934387 C3.85425855,18.7962486 2.4415751,19.4616407 1.50110376,18.6880767 C0.457861504,17.8299808 1.06082416,16.3977716 3.14863627,13.3415022 C2.46787602,12.2299657 2.07517431,10.9254483 2.07517431,9.52993822 C2.07517431,5.47764031 5.38648212,2.1926038 9.4711873,2.1926038 C10.8179022,2.1926038 12.0805488,2.54968757 13.1681731,3.17362286 L13.3580888,3.05010101 C14.7448906,2.15821314 15.8388565,1.54606949 16.6176575,1.24556541 C17.3097518,0.978517534 17.8300686,0.899054786 18.3302439,1.15989486 Z M4.45887749,14.9253851 L4.41559125,14.9910913 C4.11795229,15.4457245 3.86560776,15.8526311 3.65890655,16.2108062 L3.49816721,16.4955144 L3.50865522,16.4898735 C3.95154613,16.2275614 4.48054647,15.8793575 5.09351841,15.4461203 C4.87264876,15.2834131 4.66057788,15.1098942 4.45887749,14.9253851 Z M9.49134039,14.5561965 L9.07292702,14.8963649 C9.2044355,14.9058333 9.33724439,14.9106501 9.4711873,14.9106501 C12.4666378,14.9106501 14.8949302,12.5016233 14.8949302,9.52993822 L14.8915066,9.32852147 C13.4471202,11.0303693 11.6630499,12.7745614 9.49134039,14.5561965 Z M9.4711873,4.14922631 C6.47573683,4.14922631 4.04744444,6.55825309 4.04744444,9.52993822 C4.04744444,11.5294888 5.1468557,13.2742954 6.77869982,14.2018778 L6.32840712,14.54362 C9.82252759,11.9176167 12.4068411,9.39469638 14.2533952,6.9916563 C13.340389,5.2996803 11.541214,4.14922631 9.4711873,4.14922631 Z M16.4747185,3.47223492 L16.3243999,3.55364776 C15.8895907,3.79005335 15.3817384,4.09101293 14.8094251,4.45121967 C15.0516128,4.70196734 15.2765335,4.9700561 15.481624,5.25323094 C15.8104417,4.73879808 16.0837029,4.25645927 16.3312001,3.76607772 L16.4747185,3.47223492 Z"
          id="Combined-Shape"
          fill="#000000"
        />
        <circle
          id="Oval"
          fill="#000000"
          opacity="0.400000006"
          cx="7.5"
          cy="7.5"
          r="1.5"
        />
        <circle
          id="Oval"
          fill="#000000"
          opacity="0.400000006"
          cx="10"
          cy="6"
          r="1"
        />
      </g>
    </svg>
  );
});

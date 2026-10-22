export interface PlanetData {
  id: string;
  name: string;
  type: string;
  diameter: string;
  distanceFromSun: string; // in AU / million km
  distanceAU: number;
  orbitalPeriod: string;
  dayLength: string;
  surfaceTemp: string;
  moons: number;
  atmosphere: string;
  color: string;
  accentColor: string;
  ring: boolean;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  funFact: string;
  description: string;
  explorationHighlight: string;
}

export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'Terrestrial Planet',
    diameter: '4,879 km',
    distanceFromSun: '57.9M km (0.39 AU)',
    distanceAU: 0.39,
    orbitalPeriod: '88 Earth Days',
    dayLength: '58.6 Earth Days',
    surfaceTemp: '-180°C to 430°C',
    moons: 0,
    atmosphere: 'Trace exosphere (Oxygen, Sodium, Hydrogen)',
    color: '#8A8680',
    accentColor: '#B5AFA6',
    ring: false,
    orbitRadius: 18,
    orbitSpeed: 0.04,
    size: 1.1,
    funFact: 'Despite being closest to the Sun, Venus is hotter than Mercury due to Mercury lacking a heat-trapping atmosphere.',
    description: 'The smallest planet in the solar system and closest to the Sun, Mercury is a dense iron-rich world scarred by billions of years of impact craters.',
    explorationHighlight: 'MESSENGER spacecraft orbited Mercury from 2011 to 2015, revealing water ice inside permanently shadowed polar craters.'
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'Terrestrial Planet',
    diameter: '12,104 km',
    distanceFromSun: '108.2M km (0.72 AU)',
    distanceAU: 0.72,
    orbitalPeriod: '225 Earth Days',
    dayLength: '243 Earth Days (Retrograde)',
    surfaceTemp: '465°C (869°F)',
    moons: 0,
    atmosphere: '96.5% Carbon Dioxide, 3.5% Nitrogen (Sulfuric acid clouds)',
    color: '#E3BB76',
    accentColor: '#F5D396',
    ring: false,
    orbitRadius: 26,
    orbitSpeed: 0.028,
    size: 2.0,
    funFact: 'Venus rotates in the opposite direction to most planets, meaning the Sun rises in the west and sets in the east.',
    description: 'Earth’s toxic twin possesses a runaway greenhouse effect generating atmospheric pressures 92 times greater than Earth’s sea level.',
    explorationHighlight: 'Soviet Venera landers survived only up to 127 minutes in Venus’s extreme furnace, returning the only surface photos to date.'
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'Terrestrial Planet (Habitable)',
    diameter: '12,742 km',
    distanceFromSun: '149.6M km (1.00 AU)',
    distanceAU: 1.0,
    orbitalPeriod: '365.25 Days',
    dayLength: '24 Hours',
    surfaceTemp: '-89°C to 58°C (Avg 15°C)',
    moons: 1,
    atmosphere: '78% Nitrogen, 21% Oxygen, 0.9% Argon',
    color: '#2B82C9',
    accentColor: '#42D9F5',
    ring: false,
    orbitRadius: 35,
    orbitSpeed: 0.02,
    size: 2.2,
    funFact: 'Earth is the only known planetary body with active plate tectonics, which regulates carbon cycles and keeps our climate stable.',
    description: 'The vibrant cradle of known life, Earth features liquid surface oceans, dynamic atmospheric cloud systems, and a protective magnetosphere.',
    explorationHighlight: 'Thousands of earth observation satellites monitor biosphere shifts, climate patterns, and tectonic movements daily.'
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'Terrestrial Planet',
    diameter: '6,779 km',
    distanceFromSun: '227.9M km (1.52 AU)',
    distanceAU: 1.52,
    orbitalPeriod: '687 Earth Days',
    dayLength: '24h 37m',
    surfaceTemp: '-125°C to 20°C (Avg -63°C)',
    moons: 2,
    atmosphere: '95% Carbon Dioxide, 2.6% Molecular Nitrogen, 1.9% Argon',
    color: '#C1440E',
    accentColor: '#E26D38',
    ring: false,
    orbitRadius: 44,
    orbitSpeed: 0.016,
    size: 1.4,
    funFact: 'Mars hosts Olympus Mons, the largest volcano in the Solar System, standing nearly 3 times taller than Mount Everest.',
    description: 'Known as the Red Planet due to iron oxide rust on its surface, Mars holds dried river valleys and ancient lake beds that hint at a watery past.',
    explorationHighlight: 'Perseverance rover is currently caching rock cores in Jezero Crater to be retrieved by the joint NASA-ESA Mars Sample Return.'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Gas Giant',
    diameter: '139,820 km',
    distanceFromSun: '778.5M km (5.20 AU)',
    distanceAU: 5.2,
    orbitalPeriod: '11.86 Earth Years',
    dayLength: '9h 55m',
    surfaceTemp: '-110°C (Cloud top)',
    moons: 95,
    atmosphere: '90% Hydrogen, 10% Helium',
    color: '#D89758',
    accentColor: '#E8B688',
    ring: true,
    orbitRadius: 56,
    orbitSpeed: 0.009,
    size: 4.8,
    funFact: 'Jupiter’s magnetic field is 14 times stronger than Earth’s, creating roaring auroras larger than our entire home planet.',
    description: 'The king of planets holds twice the mass of all other solar system planets combined, acting as a gravitational shepherd protecting inner worlds.',
    explorationHighlight: 'NASA’s Juno orbiter continues to pierce Jupiter’s violent cloud decks, uncovering a diffuse fuzzy core and deep ammonia plumes.'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'Gas Giant',
    diameter: '116,460 km',
    distanceFromSun: '1.43B km (9.58 AU)',
    distanceAU: 9.58,
    orbitalPeriod: '29.45 Earth Years',
    dayLength: '10h 33m',
    surfaceTemp: '-140°C (Cloud top)',
    moons: 146,
    atmosphere: '96% Hydrogen, 3% Helium, 0.4% Methane',
    color: '#E2BF7D',
    accentColor: '#F0D5A0',
    ring: true,
    orbitRadius: 70,
    orbitSpeed: 0.0065,
    size: 4.0,
    funFact: 'Saturn has the lowest density of any planet in the solar system (0.687 g/cm³)—it would literally float if placed in a colossal bathtub.',
    description: 'Adorned by an astonishing ring system spanning over 282,000 km yet only tens of meters thick, composed of billions of water ice fragments.',
    explorationHighlight: 'Cassini-Huygens explored Saturn for 13 years before a planned atmospheric plunge, discovering geysers erupting from ice moon Enceladus.'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'Ice Giant',
    diameter: '50,724 km',
    distanceFromSun: '2.87B km (19.2 AU)',
    distanceAU: 19.2,
    orbitalPeriod: '84 Earth Years',
    dayLength: '17h 14m (Retrograde)',
    surfaceTemp: '-195°C (-320°F)',
    moons: 28,
    atmosphere: '83% Hydrogen, 15% Helium, 2% Methane',
    color: '#4B70DD',
    accentColor: '#68BBE3',
    ring: true,
    orbitRadius: 84,
    orbitSpeed: 0.0045,
    size: 2.8,
    funFact: 'Uranus rolls around the Sun on its side with an axial tilt of 97.77 degrees, likely the result of an ancient cataclysmic collision.',
    description: 'A pale cyan ice giant whose mantle is rich in water, ammonia, and methane ice, shrouded in calm-looking high-altitude hazes.',
    explorationHighlight: 'Voyager 2 remains the only spacecraft to have visited Uranus up close, flying past in January 1986.'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'Ice Giant',
    diameter: '49,244 km',
    distanceFromSun: '4.50B km (30.0 AU)',
    distanceAU: 30.0,
    orbitalPeriod: '164.8 Earth Years',
    dayLength: '16h 6m',
    surfaceTemp: '-201°C (-330°F)',
    moons: 16,
    atmosphere: '80% Hydrogen, 19% Helium, 1.5% Methane',
    color: '#274687',
    accentColor: '#4175DF',
    ring: true,
    orbitRadius: 96,
    orbitSpeed: 0.0035,
    size: 2.7,
    funFact: 'Neptune experiences the fastest winds recorded in the solar system, topping an astounding 2,100 km/h (1,300 mph).',
    description: 'The outermost major planet, an intense deep azure ice world with giant vortex storms and cryovolcanic moons like Triton.',
    explorationHighlight: 'Voyager 2 swept past Neptune in 1989, discovering the Great Dark Spot and nitrogen ice geysers on moon Triton.'
  }
];

export interface CosmosDestination {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  stats: { label: string; value: string }[];
  deepDive: {
    overview: string;
    keyPhenomena: string[];
    astrophysicsData: { key: string; val: string }[];
    scientificSignificance: string;
  };
}

export const COSMOS_DESTINATIONS: CosmosDestination[] = [
  {
    id: 'galaxies',
    tag: 'DEEP UNIVERSE // 01',
    title: 'SPIRAL GALAXIES & NEBULAE',
    subtitle: 'Cosmic Nurseries and Grand Island Universes',
    description: 'From sweeping spiral arms of Andromeda to incandescent star-forming stellar nurseries in the Carina Nebula, witness where suns are born and civilizations may rise.',
    badge: '100B+ Known Galaxies',
    stats: [
      { label: 'Milky Way Diameter', value: '105,700 ly' },
      { label: 'Estimated Stars', value: '100-400 Billion' },
      { label: 'Nearest Spiral', value: 'Andromeda (2.537M ly)' }
    ],
    deepDive: {
      overview: 'Galaxies are vast gravitationally bound systems of stars, stellar remnants, interstellar gas, dust, and mysterious dark matter. Observations from the James Webb Space Telescope reveal complex spiral structures that developed only a few hundred million years after the Big Bang.',
      keyPhenomena: [
        'Density waves compressing gas to trigger bursts of star formation',
        'Supermassive central black holes regulating galactic growth via relativistic jets',
        'Interstellar chemical enrichment through massive supernova explosions'
      ],
      astrophysicsData: [
        { key: 'Dark Matter Ratio', val: '~85% of total galactic mass' },
        { key: 'Galactic Orbital Velocity', val: '220 km/s (Solar System orbit)' },
        { key: 'Future Event', val: 'Milky Way - Andromeda collision in ~4.5B years' }
      ],
      scientificSignificance: 'Understanding galactic morphology decodes cosmic evolution, element nucleosynthesis, and the expansion dynamics of the cosmological web.'
    }
  },
  {
    id: 'black-holes',
    tag: 'EXTREME GRAVITY // 02',
    title: 'BLACK HOLES & EVENT HORIZONS',
    subtitle: 'Where Spacetime Tears and Physics Reaches its Limit',
    description: 'Explore the gravitational titans where escape velocity exceeds the speed of light. Accretion disks glow hotter than billions of suns while time dilates to infinity.',
    badge: 'Singularity Threshold',
    stats: [
      { label: 'Sagittarius A* Mass', value: '4.15M Solar Masses' },
      { label: 'M87* Mass', value: '6.5B Solar Masses' },
      { label: 'Event Horizon Escape Speed', value: 'c (299,792 km/s)' }
    ],
    deepDive: {
      overview: 'Formed from collapsing hypermassive stars or primordial density fluctuations, black holes are the ultimate laboratory for general relativity and quantum mechanics. The Event Horizon Telescope has resolved their shadow, revealing relativistic photon rings bent by extreme frame-dragging.',
      keyPhenomena: [
        'Gravitational time dilation: time appears frozen to outside observers at the horizon',
        'Superheated accretion disks reaching billions of Kelvin emitting intense X-rays',
        'Relativistic plasma jets fired along magnetic poles at 99% light speed'
      ],
      astrophysicsData: [
        { key: 'Schwarzschild Radius Eq.', val: 'Rs = 2GM / c²' },
        { key: 'Sagittarius A* Distance', val: '26,673 light-years from Earth' },
        { key: 'Quantum Effect', val: 'Hawking Radiation thermal emission' }
      ],
      scientificSignificance: 'Black holes are key to resolving the greatest puzzle in modern theoretical physics: the reconciliation between Einstein’s General Relativity and Quantum Mechanics.'
    }
  },
  {
    id: 'exoplanets',
    tag: 'HABITABLE WORLDS // 03',
    title: 'EXOPLANETS & STRANGE WORLDS',
    subtitle: 'Seeking Biomarkers in Distant Star Systems',
    description: 'Beyond our solar system lie over 5,500 confirmed alien worlds: ocean planets, super-Earths in the Goldilocks zone, and worlds with twin suns.',
    badge: '5,500+ Confirmed Worlds',
    stats: [
      { label: 'Closest Exoplanet', value: 'Proxima Centauri b (4.24 ly)' },
      { label: 'Habitable Red Dwarf System', value: 'TRAPPIST-1 (7 Worlds)' },
      { label: 'Earth Cousin', value: 'Kepler-452b (1,402 ly)' }
    ],
    deepDive: {
      overview: 'Through high-precision transit photometry and radial velocity measurements, astronomers have discovered an immense variety of exoplanetary architectures. JWST transmission spectroscopy now inspects atmospheric compositions for water vapor, carbon dioxide, and methane.',
      keyPhenomena: [
        'Goldilocks circumstellar habitable zone supporting liquid surface water',
        'Tidal locking causing permanent day and night hemispheres',
        'Atmospheric transmission filtering starlight to reveal molecular signatures'
      ],
      astrophysicsData: [
        { key: 'Primary Detection Methods', val: 'Transit photometry & Radial velocity' },
        { key: 'TRAPPIST-1e ESI Score', val: '0.85 (Earth Similarity Index)' },
        { key: 'Target Biosignature Gases', val: 'O3, CH4, N2O, DMS (Dimethyl sulfide)' }
      ],
      scientificSignificance: 'The detection of atmospheric chemical disequilibrium on a temperate rocky exoplanet could confirm the existence of extraterrestrial biological activity within our lifetimes.'
    }
  }
];

export interface MissionData {
  id: string;
  name: string;
  program: string;
  year: string;
  status: 'Active' | 'Completed' | 'In Transit';
  type: string;
  distance: string;
  objective: string;
  description: string;
  keyMilestones: string[];
  specs: { label: string; value: string }[];
}

export const MISSIONS: MissionData[] = [
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    program: 'Interstellar Mission',
    year: '1977 – Present',
    status: 'Active',
    type: 'Interstellar Spacecraft',
    distance: '~24.4 Billion km (163 AU)',
    objective: 'Explore the outer heliosphere boundary and sample genuine interstellar space.',
    description: 'The farthest human-made object from Earth. Having completed flybys of Jupiter and Saturn, Voyager 1 crossed the heliopause in 2012 and continues sending scientific telemetry from between the stars.',
    keyMilestones: [
      'Discovered active volcanism on Jupiter’s moon Io (1979)',
      'Captured the legendary "Pale Blue Dot" photograph at 6 billion km (1990)',
      'Crossed the heliopause into true interstellar medium (2012)',
      'Operational for over 48 consecutive years'
    ],
    specs: [
      { label: 'Launch Vehicle', value: 'Titan IIIE / Centaur' },
      { label: 'Power Source', value: 'Radioisotope Thermoelectric (RTG)' },
      { label: 'Velocity', value: '61,200 km/h (17 km/s)' },
      { label: 'Signal Travel Time', value: '~22.5 hours each way' }
    ]
  },
  {
    id: 'apollo-11',
    name: 'Apollo 11',
    program: 'Apollo Lunar Program',
    year: '1969',
    status: 'Completed',
    type: 'Crewed Lunar Landing',
    distance: '384,400 km (The Moon)',
    objective: 'Perform a crewed lunar landing and safely return the astronauts to Earth.',
    description: 'Neil Armstrong and Buzz Aldrin landed the Lunar Module Eagle on the Sea of Tranquility on July 20, 1969, fulfilling humanity’s age-old dream of stepping onto another celestial body.',
    keyMilestones: [
      'Liftoff from Launch Complex 39A on Saturn V rocket (July 16, 1969)',
      'First human footsteps: "One small step for man, one giant leap for mankind"',
      'Collected 21.5 kg (47.5 lb) of lunar surface material',
      'Safe Pacific Ocean splashdown on July 24, 1969'
    ],
    specs: [
      { label: 'Rocket', value: 'Saturn V (111m tall)' },
      { label: 'Crew', value: 'Armstrong, Aldrin, Collins' },
      { label: 'Lunar Surface Stay', value: '21 hours 36 minutes' },
      { label: 'Payload to Orbit', value: '45,000 kg' }
    ]
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    program: 'NASA / ESA / CSA Flagship',
    year: '2021 – Present',
    status: 'Active',
    type: 'Space Observatory',
    distance: '1.5 Million km (Sun-Earth L2)',
    objective: 'Observe the earliest stars and galaxies formed after the Big Bang and characterize exoplanet atmospheres.',
    description: 'Equipped with a 6.5-meter gold-coated beryllium primary mirror and a tennis-court-sized sunshield, Webb peers through cosmic dust to capture infrared light emitted over 13.5 billion years ago.',
    keyMilestones: [
      'Flawless Ariane 5 launch on Christmas Day 2021',
      'Unfolded complex 5-layer sunshield in deep space with zero margin for error',
      'Captured deepest infrared image of early universe (SMACS 0723)',
      'Identified water and carbon compounds in alien exoplanet atmospheres'
    ],
    specs: [
      { label: 'Primary Mirror', value: '6.5m (18 Hexagonal Segments)' },
      { label: 'Operating Temp', value: '7 Kelvin (-266°C) for MIRI' },
      { label: 'Orbit', value: 'Halo orbit at Sun-Earth L2' },
      { label: 'Design Life', value: '20+ years (fuel optimized)' }
    ]
  },
  {
    id: 'artemis',
    name: 'Artemis Program',
    program: 'NASA Moon to Mars',
    year: '2022 – Active',
    status: 'In Transit',
    type: 'Next-Gen Lunar & Deep Space Exploration',
    distance: 'Cislunar & Lunar South Pole',
    objective: 'Establish the first long-term human scientific outpost at the Moon’s water-ice rich South Pole.',
    description: 'Artemis will land the first woman and first person of color on the Moon. Combining the SLS super heavy-lift rocket, Orion spacecraft, and Lunar Gateway orbital station to prepare for human missions to Mars.',
    keyMilestones: [
      'Artemis I uncrewed Orion mission traveled 432,000 km past Earth (2022)',
      'Artemis II crew announced for human circumlunar flyby',
      'Starship HLS selected for Human Landing System at Lunar South Pole',
      'International Artemis Accords signed by over 40 spacefaring nations'
    ],
    specs: [
      { label: 'Launch System', value: 'SLS Block 1 (39.1 MN thrust)' },
      { label: 'Crew Capsule', value: 'Orion Spacecraft' },
      { label: 'Target Destination', value: 'Shackleton Crater, Moon' },
      { label: 'Key Resource', value: 'Subsurface Water Ice Volatiles' }
    ]
  },
  {
    id: 'perseverance',
    name: 'Perseverance & Ingenuity',
    program: 'Mars 2020 Mission',
    year: '2020 – Present',
    status: 'Active',
    type: 'Robotic Rover & Rotorcraft',
    distance: '~225 Million km (Mars)',
    objective: 'Search for signs of ancient microbial life in Jezero Crater and demonstrate powered flight on another world.',
    description: 'The most sophisticated astrobiology rover ever deployed, carrying MOXIE (oxygen generator) and the legendary Ingenuity helicopter, which completed 72 historic flights through the thin Martian atmosphere.',
    keyMilestones: [
      'Sky Crane touchdown in Jezero Crater (Feb 18, 2021)',
      'Ingenuity performed first powered, controlled flight on another planet (April 2021)',
      'Successfully extracted breathable oxygen from Martian CO2 via MOXIE',
      'Sealed 24+ pristine rock core samples in hermetic tubes for Earth return'
    ],
    specs: [
      { label: 'Mass', value: '1,025 kg (Rover) + 1.8 kg (Helicopter)' },
      { label: 'Instruments', value: 'SuperCam, PIXL, SHERLOC, RIMFAX' },
      { label: 'Power', value: 'Multi-Mission RTG (Plutonium-238)' },
      { label: 'Ingenuity Flights', value: '72 flights (17 km distance flown)' }
    ]
  },
  {
    id: 'iss',
    name: 'International Space Station',
    program: 'Global Orbital Laboratory',
    year: '1998 – Present',
    status: 'Active',
    type: 'Crewed Low-Earth Orbital Complex',
    distance: '408 km Altitude (LEO)',
    objective: 'Conduct scientific microgravity research impossible on the surface of Earth.',
    description: 'A masterpiece of international peaceful collaboration. Traveling at 28,000 km/h, the station has been continuously inhabited since November 2000, serving as humanity’s premier testbed for long-duration deep space survival.',
    keyMilestones: [
      'Zarya module launch began on-orbit assembly (1998)',
      'Continuously occupied for 25+ consecutive years',
      'Over 3,000 scientific investigations conducted from 100+ nations',
      'Spans the size of an American football field with solar wings'
    ],
    specs: [
      { label: 'Orbital Speed', value: '27,600 km/h (92 min per orbit)' },
      { label: 'Mass', value: '440,000 kg' },
      { label: 'Crew Capacity', value: '7 Expedition astronauts' },
      { label: 'Sunrise/Sunsets', value: '16 per Earth day' }
    ]
  }
];

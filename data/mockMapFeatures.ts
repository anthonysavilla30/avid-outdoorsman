
import { SkiResort, Forest, Campground, WildlifeManagementArea } from '@/types/MapFeature';

export const mockSkiResorts: SkiResort[] = [
  {
    id: 'ski-1',
    name: 'Vail Mountain Resort',
    description: 'World-class ski resort with over 5,300 acres of terrain',
    coordinates: {
      latitude: 39.6403,
      longitude: -106.3742,
    },
    trails: [
      {
        id: 'trail-1',
        name: 'Blue Sky Basin',
        difficulty: 'intermediate',
        length: 2.5,
        verticalDrop: 1200,
        open: true,
      },
      {
        id: 'trail-2',
        name: 'Born Free',
        difficulty: 'beginner',
        length: 1.8,
        verticalDrop: 600,
        open: true,
      },
      {
        id: 'trail-3',
        name: 'Blue Ox',
        difficulty: 'expert',
        length: 3.2,
        verticalDrop: 2100,
        open: true,
      },
      {
        id: 'trail-4',
        name: 'Simba',
        difficulty: 'advanced',
        length: 2.1,
        verticalDrop: 1500,
        open: false,
      },
      {
        id: 'trail-5',
        name: 'Avanti',
        difficulty: 'intermediate',
        length: 1.9,
        verticalDrop: 900,
        open: true,
      },
    ],
    lifts: 31,
    baseElevation: 8120,
    summitElevation: 11570,
    acres: 5317,
    season: {
      start: 'November',
      end: 'April',
    },
    amenities: ['Ski School', 'Equipment Rental', 'Restaurants', 'Lodging', 'Childcare'],
  },
  {
    id: 'ski-2',
    name: 'Breckenridge Ski Resort',
    description: 'Historic mining town turned premier ski destination',
    coordinates: {
      latitude: 39.4817,
      longitude: -106.0384,
    },
    trails: [
      {
        id: 'trail-6',
        name: 'Springmeier',
        difficulty: 'beginner',
        length: 2.0,
        verticalDrop: 500,
        open: true,
      },
      {
        id: 'trail-7',
        name: 'Cashier',
        difficulty: 'intermediate',
        length: 1.5,
        verticalDrop: 800,
        open: true,
      },
      {
        id: 'trail-8',
        name: 'Devil\'s Crotch',
        difficulty: 'expert',
        length: 0.8,
        verticalDrop: 1100,
        open: true,
      },
    ],
    lifts: 35,
    baseElevation: 9600,
    summitElevation: 12998,
    acres: 2908,
    season: {
      start: 'November',
      end: 'May',
    },
    amenities: ['Ski School', 'Equipment Rental', 'Restaurants', 'Lodging', 'Terrain Park'],
  },
  {
    id: 'ski-3',
    name: 'Aspen Snowmass',
    description: 'Four mountains, one unforgettable experience',
    coordinates: {
      latitude: 39.2091,
      longitude: -106.9378,
    },
    trails: [
      {
        id: 'trail-9',
        name: 'Elk Camp',
        difficulty: 'intermediate',
        length: 2.8,
        verticalDrop: 1400,
        open: true,
      },
      {
        id: 'trail-10',
        name: 'Big Burn',
        difficulty: 'advanced',
        length: 3.5,
        verticalDrop: 2000,
        open: true,
      },
    ],
    lifts: 43,
    baseElevation: 8104,
    summitElevation: 12510,
    acres: 5527,
    season: {
      start: 'November',
      end: 'April',
    },
    amenities: ['Ski School', 'Equipment Rental', 'Restaurants', 'Lodging', 'Spa'],
  },
];

export const mockNationalForests: Forest[] = [
  {
    id: 'nf-1',
    name: 'White River National Forest',
    type: 'national',
    description: 'Colorado\'s most visited national forest with stunning alpine scenery',
    coordinates: {
      latitude: 39.3639,
      longitude: -106.8175,
    },
    acres: 2300000,
    activities: ['Hiking', 'Camping', 'Fishing', 'Hunting', 'Mountain Biking', 'Skiing'],
    regulations: [
      'Campfire permits required',
      'Pack out all trash',
      'Stay on designated trails',
      'Wilderness permits for overnight stays',
    ],
  },
  {
    id: 'nf-2',
    name: 'Pike National Forest',
    type: 'national',
    description: 'Home to Pikes Peak and diverse recreational opportunities',
    coordinates: {
      latitude: 39.0639,
      longitude: -105.3578,
    },
    acres: 1106604,
    activities: ['Hiking', 'Rock Climbing', 'Camping', 'Fishing', 'Wildlife Viewing'],
    regulations: [
      'Fire restrictions in effect',
      'Leash pets at all times',
      'No motorized vehicles on trails',
      'Respect wildlife closures',
    ],
  },
  {
    id: 'nf-3',
    name: 'Roosevelt National Forest',
    type: 'national',
    description: 'Rugged mountain terrain with excellent backcountry access',
    coordinates: {
      latitude: 40.3772,
      longitude: -105.6816,
    },
    acres: 813799,
    activities: ['Backpacking', 'Fishing', 'Hunting', 'Horseback Riding', 'Winter Sports'],
    regulations: [
      'Bear canisters required in some areas',
      'Group size limits apply',
      'Dispersed camping allowed',
      'Check avalanche conditions',
    ],
  },
];

export const mockStateForests: Forest[] = [
  {
    id: 'sf-1',
    name: 'State Forest State Park',
    type: 'state',
    description: 'Colorado\'s moose viewing capital with pristine wilderness',
    coordinates: {
      latitude: 40.6708,
      longitude: -106.1503,
    },
    acres: 71000,
    activities: ['Moose Viewing', 'Camping', 'Fishing', 'Hiking', 'Mountain Biking'],
    regulations: [
      'State park pass required',
      'Quiet hours 10pm-6am',
      'Maximum 14-day stay',
      'Pets allowed on leash',
    ],
  },
  {
    id: 'sf-2',
    name: 'Mueller State Park',
    type: 'state',
    description: 'High-altitude park with panoramic views and abundant wildlife',
    coordinates: {
      latitude: 38.8897,
      longitude: -105.1886,
    },
    acres: 5112,
    activities: ['Hiking', 'Wildlife Photography', 'Camping', 'Cross-Country Skiing'],
    regulations: [
      'Day use fee applies',
      'Stay on marked trails',
      'No hunting allowed',
      'Campground reservations recommended',
    ],
  },
];

export const mockCampgrounds: Campground[] = [
  {
    id: 'camp-1',
    name: 'Moraine Park Campground',
    description: 'Scenic campground in Rocky Mountain National Park',
    coordinates: {
      latitude: 40.3580,
      longitude: -105.5897,
    },
    sites: 244,
    amenities: ['Restrooms', 'Potable Water', 'Dump Station', 'Amphitheater', 'Ranger Programs'],
    reservable: true,
    fee: '$30 per night',
    season: {
      start: 'Year-round',
      end: 'Year-round',
    },
  },
  {
    id: 'camp-2',
    name: 'Maroon Bells Campground',
    description: 'High-altitude camping near iconic Maroon Bells peaks',
    coordinates: {
      latitude: 39.0708,
      longitude: -106.9389,
    },
    sites: 44,
    amenities: ['Vault Toilets', 'Potable Water', 'Fire Rings', 'Picnic Tables'],
    reservable: true,
    fee: '$25 per night',
    season: {
      start: 'June',
      end: 'September',
    },
  },
  {
    id: 'camp-3',
    name: 'Peaceful Valley Campground',
    description: 'Riverside camping with excellent fishing access',
    coordinates: {
      latitude: 40.1847,
      longitude: -105.5258,
    },
    sites: 17,
    amenities: ['Vault Toilets', 'Fire Rings', 'Picnic Tables', 'River Access'],
    reservable: false,
    fee: '$20 per night',
    season: {
      start: 'May',
      end: 'October',
    },
  },
  {
    id: 'camp-4',
    name: 'Weston Pass Campground',
    description: 'Remote high-elevation camping with stunning views',
    coordinates: {
      latitude: 39.1847,
      longitude: -106.1258,
    },
    sites: 14,
    amenities: ['Vault Toilets', 'Fire Rings', 'Picnic Tables'],
    reservable: false,
    fee: '$18 per night',
    season: {
      start: 'June',
      end: 'September',
    },
  },
];

export const mockWildlifeManagementAreas: WildlifeManagementArea[] = [
  {
    id: 'wma-1',
    name: 'Pawnee National Grassland WMA',
    description: 'Shortgrass prairie ecosystem with diverse bird species',
    coordinates: {
      latitude: 40.8167,
      longitude: -104.3167,
    },
    acres: 193060,
    species: ['Pronghorn', 'Mule Deer', 'Prairie Dogs', 'Raptors', 'Waterfowl'],
    activities: ['Hunting', 'Wildlife Viewing', 'Bird Watching', 'Photography', 'Hiking'],
    regulations: [
      'Hunting license required',
      'Check season dates',
      'Respect private property boundaries',
      'No camping in WMA',
    ],
    huntingSeasons: ['Deer: Oct-Nov', 'Pronghorn: Sep-Oct', 'Waterfowl: Oct-Jan'],
  },
  {
    id: 'wma-2',
    name: 'Tamarack Ranch WMA',
    description: 'Premier elk and deer habitat in mountain foothills',
    coordinates: {
      latitude: 40.0167,
      longitude: -105.2167,
    },
    acres: 10000,
    species: ['Elk', 'Mule Deer', 'Black Bear', 'Mountain Lion', 'Wild Turkey'],
    activities: ['Hunting', 'Wildlife Viewing', 'Hiking', 'Photography'],
    regulations: [
      'Limited access during calving season',
      'Hunting by permit only',
      'No motorized vehicles',
      'Day use only',
    ],
    huntingSeasons: ['Elk: Sep-Nov', 'Deer: Oct-Nov', 'Turkey: Apr-May, Sep'],
  },
  {
    id: 'wma-3',
    name: 'Bonny Lake WMA',
    description: 'Wetland habitat attracting migratory waterfowl',
    coordinates: {
      latitude: 39.6333,
      longitude: -102.1667,
    },
    acres: 1900,
    species: ['Waterfowl', 'Shorebirds', 'White Pelicans', 'Bald Eagles', 'Deer'],
    activities: ['Waterfowl Hunting', 'Bird Watching', 'Fishing', 'Photography'],
    regulations: [
      'Waterfowl stamp required',
      'Steel shot only',
      'Boat access permitted',
      'Respect nesting areas',
    ],
    huntingSeasons: ['Waterfowl: Oct-Jan', 'Deer: Nov'],
  },
  {
    id: 'wma-4',
    name: 'Dome Rock WMA',
    description: 'Sagebrush habitat for big game and upland birds',
    coordinates: {
      latitude: 38.5333,
      longitude: -106.0667,
    },
    acres: 7200,
    species: ['Mule Deer', 'Elk', 'Sage Grouse', 'Chukar', 'Mountain Lion'],
    activities: ['Big Game Hunting', 'Upland Bird Hunting', 'Wildlife Viewing', 'Hiking'],
    regulations: [
      'Seasonal closures for wildlife',
      'Hunting license required',
      'No camping',
      'Respect closure signs',
    ],
    huntingSeasons: ['Deer: Oct-Nov', 'Elk: Sep-Nov', 'Sage Grouse: Sep'],
  },
];

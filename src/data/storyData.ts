import { StoryPage, RetellCard, Character } from '../types';

export const LEO_CHARACTER: Character = {
  name: 'Leo',
  avatarIcon: '👦',
  role: 'Young Detective',
};

export const BARNABY_CHARACTER: Character = {
  name: 'Barnaby',
  avatarIcon: '🐱',
  role: 'Clever Cat Companion',
};

export const COVER_IMAGE = '/src/assets/images/cover_detective_compass_1791543483732.jpg';
export const ATTIC_IMAGE = '/src/assets/images/scene_attic_clues_1791543498126.jpg';
export const GARDEN_IMAGE = '/src/assets/images/scene_garden_treehouse_1791543510874.jpg';
export const LIBRARY_IMAGE = '/src/assets/images/scene_secret_library_1791543522641.jpg';

export const STORY_PAGES: StoryPage[] = [
  {
    pageNumber: 1,
    title: 'The Attic Room',
    image: ATTIC_IMAGE,
    imageAlt: 'Cozy sunlit attic with wooden boxes, clock on the wall, and rocking chair',
    sceneTheme: 'Attic Search',
    sentences: [
      {
        fullText: 'Leo and Barnaby walk up the stairs to the attic.',
        parts: [{ text: 'Leo and Barnaby walk up the stairs to the attic.' }],
      },
      {
        fullText: 'Sunlight shines through the round window.',
        parts: [
          { text: 'Sunlight shines ' },
          { text: 'through', isPreposition: true },
          { text: ' the round window.' },
        ],
      },
      {
        fullText: 'There is a big wooden box on the floor.',
        parts: [
          { text: 'There is a big wooden box ' },
          { text: 'on', isPreposition: true },
          { text: ' the floor.' },
        ],
      },
      {
        fullText: 'Barnaby the cat sits quietly on the rocking chair.',
        parts: [
          { text: 'Barnaby the cat sits quietly ' },
          { text: 'on', isPreposition: true },
          { text: ' the rocking chair.' },
        ],
      },
      {
        fullText: 'Leo sees an old clock on the wall.',
        parts: [
          { text: 'Leo sees an old clock ' },
          { text: 'on', isPreposition: true },
          { text: ' the wall.' },
        ],
      },
      {
        fullText: 'A paper note is hidden behind the clock.',
        parts: [
          { text: 'A paper note is hidden ' },
          { text: 'behind', isPreposition: true },
          { text: ' the clock.', isObject: true },
        ],
      },
    ],
    question: {
      character: BARNABY_CHARACTER,
      questionText: 'Where is the paper note hidden?',
      fullAnswer: 'The paper note is behind the clock.',
      targetPreposition: 'behind',
      targetObject: 'clock',
      hint: 'Look at the clock on the wall.',
      level1: {
        template: ['The paper note is', 'the clock.'],
        correctAnswers: ['behind'],
        options: ['behind', 'on', 'under', 'in front of'],
      },
      level2: {
        template: ['The paper note is', 'the', '.'],
        correctAnswers: ['behind', 'clock'],
        options: ['behind', 'clock', 'under', 'chair', 'on'],
      },
      level3: {
        template: ['The paper note', '', 'the', '.'],
        correctAnswers: ['is', 'behind', 'clock'],
        options: ['is', 'behind', 'clock', 'was', 'under', 'lamp'],
      },
      level4Chunks: ['The paper note', 'is', 'behind', 'the clock.'],
      level5WordBank: ['The', 'paper', 'note', 'is', 'behind', 'the', 'clock.', 'under', 'on'],
    },
  },
  {
    pageNumber: 2,
    title: 'The Secret Note',
    image: ATTIC_IMAGE,
    imageAlt: 'Attic table with books, glass bottles, and tea cup',
    sceneTheme: 'Finding the Key',
    sentences: [
      {
        fullText: 'Leo takes the note in his hand.',
        parts: [{ text: 'Leo takes the note in his hand.' }],
      },
      {
        fullText: 'The gold words shine in the bright light.',
        parts: [
          { text: 'The gold words shine ' },
          { text: 'in', isPreposition: true },
          { text: ' the bright light.' },
        ],
      },
      {
        fullText: 'A blue bowl sits next to the window.',
        parts: [
          { text: 'A blue bowl sits ' },
          { text: 'next to', isPreposition: true },
          { text: ' the window.' },
        ],
      },
      {
        fullText: 'Three glass bottles stand between the plant pots.',
        parts: [
          { text: 'Three glass bottles stand ' },
          { text: 'between', isPreposition: true },
          { text: ' the plant pots.' },
        ],
      },
      {
        fullText: "The note says: 'Find the first key in the room!'",
        parts: [{ text: "The note says: 'Find the first key in the room!'" }],
      },
      {
        fullText: 'Leo finds a shiny key in the tea cup.',
        parts: [
          { text: 'Leo finds a shiny key ' },
          { text: 'in', isPreposition: true },
          { text: ' the tea cup.', isObject: true },
        ],
      },
    ],
    question: {
      character: LEO_CHARACTER,
      questionText: 'Where is the shiny key?',
      fullAnswer: 'The shiny key is in the tea cup.',
      targetPreposition: 'in',
      targetObject: 'tea cup',
      hint: 'Look in the warm tea cup near the books.',
      level1: {
        template: ['The shiny key is', 'the tea cup.'],
        correctAnswers: ['in'],
        options: ['in', 'under', 'behind', 'next to'],
      },
      level2: {
        template: ['The shiny key is', 'the tea', '.'],
        correctAnswers: ['in', 'cup'],
        options: ['in', 'cup', 'on', 'box', 'under'],
      },
      level3: {
        template: ['The shiny key', '', 'the tea', '.'],
        correctAnswers: ['is', 'in', 'cup'],
        options: ['is', 'in', 'cup', 'at', 'under', 'book'],
      },
      level4Chunks: ['The shiny key', 'is', 'in', 'the tea cup.'],
      level5WordBank: ['The', 'shiny', 'key', 'is', 'in', 'the', 'tea', 'cup.', 'on', 'under'],
    },
  },
  {
    pageNumber: 3,
    title: 'Under the Big Box',
    image: ATTIC_IMAGE,
    imageAlt: 'Wooden box sitting on floorboards in attic',
    sceneTheme: 'Under the Box',
    sentences: [
      {
        fullText: 'Barnaby jumps down from the rocking chair.',
        parts: [{ text: 'Barnaby jumps down from the rocking chair.' }],
      },
      {
        fullText: 'He walks to the quiet corner of the room.',
        parts: [{ text: 'He walks to the quiet corner of the room.' }],
      },
      {
        fullText: 'Two brown boxes sit in front of the bookshelf.',
        parts: [
          { text: 'Two brown boxes sit ' },
          { text: 'in front of', isPreposition: true },
          { text: ' the bookshelf.' },
        ],
      },
      {
        fullText: 'A small basket rests next to the boxes.',
        parts: [
          { text: 'A small basket rests ' },
          { text: 'next to', isPreposition: true },
          { text: ' the boxes.' },
        ],
      },
      {
        fullText: 'Leo looks under the big wooden box.',
        parts: [
          { text: 'Leo looks ' },
          { text: 'under', isPreposition: true },
          { text: ' the big wooden box.' },
        ],
      },
      {
        fullText: 'A small glass lens lies under the box.',
        parts: [
          { text: 'A small glass lens lies ' },
          { text: 'under', isPreposition: true },
          { text: ' the box.', isObject: true },
        ],
      },
    ],
    question: {
      character: BARNABY_CHARACTER,
      questionText: 'Where does the glass lens lie?',
      fullAnswer: 'The glass lens lies under the box.',
      targetPreposition: 'under',
      targetObject: 'box',
      hint: 'Look down below the heavy wooden box.',
      level1: {
        template: ['The glass lens lies', 'the box.'],
        correctAnswers: ['under'],
        options: ['under', 'on', 'behind', 'next to'],
      },
      level2: {
        template: ['The glass lens lies', 'the', '.'],
        correctAnswers: ['under', 'box'],
        options: ['under', 'box', 'in', 'window', 'on'],
      },
      level3: {
        template: ['The glass lens', '', 'the', '.'],
        correctAnswers: ['lies', 'under', 'box'],
        options: ['lies', 'under', 'box', 'stands', 'in', 'desk'],
      },
      level4Chunks: ['The glass lens', 'lies', 'under', 'the box.'],
      level5WordBank: ['The', 'glass', 'lens', 'lies', 'under', 'the', 'box.', 'on', 'in'],
    },
  },
  {
    pageNumber: 4,
    title: 'Looking at the Books',
    image: ATTIC_IMAGE,
    imageAlt: 'Wooden bookshelf with plants and old books',
    sceneTheme: 'Between the Books',
    sentences: [
      {
        fullText: 'Leo uses the glass lens to read small numbers.',
        parts: [{ text: 'Leo uses the glass lens to read small numbers.' }],
      },
      {
        fullText: 'The tall bookshelf holds many story books.',
        parts: [{ text: 'The tall bookshelf holds many story books.' }],
      },
      {
        fullText: 'A green plant sits on the wooden shelf.',
        parts: [
          { text: 'A green plant sits ' },
          { text: 'on', isPreposition: true },
          { text: ' the wooden shelf.' },
        ],
      },
      {
        fullText: 'A red notebook is between two thick books.',
        parts: [
          { text: 'A red notebook is ' },
          { text: 'between', isPreposition: true },
          { text: ' two thick books.', isObject: true },
        ],
      },
      {
        fullText: 'Barnaby looks at the books with big eyes.',
        parts: [{ text: 'Barnaby looks at the books with big eyes.' }],
      },
      {
        fullText: 'A small paper map is kept in the notebook.',
        parts: [
          { text: 'A small paper map is kept ' },
          { text: 'in', isPreposition: true },
          { text: ' the notebook.' },
        ],
      },
    ],
    question: {
      character: LEO_CHARACTER,
      questionText: 'Where is the red notebook?',
      fullAnswer: 'The red notebook is between two thick books.',
      targetPreposition: 'between',
      targetObject: 'books',
      hint: 'It sits in the middle of two thick books.',
      level1: {
        template: ['The red notebook is', 'two thick books.'],
        correctAnswers: ['between'],
        options: ['between', 'in', 'under', 'behind'],
      },
      level2: {
        template: ['The red notebook is', 'two thick', '.'],
        correctAnswers: ['between', 'books'],
        options: ['between', 'books', 'on', 'chairs', 'under'],
      },
      level3: {
        template: ['The red notebook', '', 'two thick', '.'],
        correctAnswers: ['is', 'between', 'books'],
        options: ['is', 'between', 'books', 'are', 'under', 'desk'],
      },
      level4Chunks: ['The red notebook', 'is', 'between', 'two thick books.'],
      level5WordBank: ['The', 'red', 'notebook', 'is', 'between', 'two', 'thick', 'books.', 'in', 'on'],
    },
  },
  {
    pageNumber: 5,
    title: 'Down into the Garden',
    image: GARDEN_IMAGE,
    imageAlt: 'Sunny garden backyard with bench and flowers',
    sceneTheme: 'Garden Bench',
    sentences: [
      {
        fullText: 'The paper note points outside to the sunny garden.',
        parts: [{ text: 'The paper note points outside to the sunny garden.' }],
      },
      {
        fullText: 'Green grass and colorful flowers welcome them.',
        parts: [{ text: 'Green grass and colorful flowers welcome them.' }],
      },
      {
        fullText: 'A wooden bench stands in front of the flowers.',
        parts: [
          { text: 'A wooden bench stands ' },
          { text: 'in front of', isPreposition: true },
          { text: ' the flowers.' },
        ],
      },
      {
        fullText: 'A shiny red watering can sits under the bench.',
        parts: [
          { text: 'A shiny red watering can sits ' },
          { text: 'under', isPreposition: true },
          { text: ' the bench.', isObject: true },
        ],
      },
      {
        fullText: 'A yellow straw hat rests on the garden bench.',
        parts: [
          { text: 'A yellow straw hat rests ' },
          { text: 'on', isPreposition: true },
          { text: ' the garden bench.' },
        ],
      },
      {
        fullText: 'Barnaby walks happily on the stone path.',
        parts: [{ text: 'Barnaby walks happily on the stone path.' }],
      },
    ],
    question: {
      character: BARNABY_CHARACTER,
      questionText: 'Where is the red watering can?',
      fullAnswer: 'The red watering can is under the bench.',
      targetPreposition: 'under',
      targetObject: 'bench',
      hint: 'Look below the wooden seat on the path.',
      level1: {
        template: ['The red watering can is', 'the bench.'],
        correctAnswers: ['under'],
        options: ['under', 'in front of', 'on', 'behind'],
      },
      level2: {
        template: ['The red watering can is', 'the', '.'],
        correctAnswers: ['under', 'bench'],
        options: ['under', 'bench', 'in', 'tree', 'on'],
      },
      level3: {
        template: ['The red watering can', '', 'the', '.'],
        correctAnswers: ['is', 'under', 'bench'],
        options: ['is', 'under', 'bench', 'was', 'on', 'grass'],
      },
      level4Chunks: ['The red watering can', 'is', 'under', 'the bench.'],
      level5WordBank: ['The', 'red', 'watering', 'can', 'is', 'under', 'the', 'bench.', 'behind', 'in'],
    },
  },
  {
    pageNumber: 6,
    title: 'The Big Garden Tree',
    image: GARDEN_IMAGE,
    imageAlt: 'Big tree with treehouse and ladder',
    sceneTheme: 'Oak Tree & Ladder',
    sentences: [
      {
        fullText: 'Leo walks across the stone path.',
        parts: [{ text: 'Leo walks across the stone path.' }],
      },
      {
        fullText: 'A big green tree stands in the center of the garden.',
        parts: [
          { text: 'A big green tree stands ' },
          { text: 'in', isPreposition: true },
          { text: ' the center of the garden.' },
        ],
      },
      {
        fullText: 'A wooden treehouse is built in the big branches.',
        parts: [
          { text: 'A wooden treehouse is built ' },
          { text: 'in', isPreposition: true },
          { text: ' the big branches.' },
        ],
      },
      {
        fullText: 'A tall rope ladder hangs next to the tree.',
        parts: [
          { text: 'A tall rope ladder hangs ' },
          { text: 'next to', isPreposition: true },
          { text: ' the tree.', isObject: true },
        ],
      },
      {
        fullText: 'A blue bird sings happily on the wooden fence.',
        parts: [
          { text: 'A blue bird sings happily ' },
          { text: 'on', isPreposition: true },
          { text: ' the wooden fence.' },
        ],
      },
      {
        fullText: 'Leo sees an arrow sign on the wood.',
        parts: [{ text: 'Leo sees an arrow sign on the wood.' }],
      },
    ],
    question: {
      character: LEO_CHARACTER,
      questionText: 'Where is the rope ladder hanging?',
      fullAnswer: 'The rope ladder hangs next to the tree.',
      targetPreposition: 'next to',
      targetObject: 'tree',
      hint: 'It hangs right beside the tall tree.',
      level1: {
        template: ['The rope ladder hangs', 'the tree.'],
        correctAnswers: ['next to'],
        options: ['next to', 'under', 'in', 'behind'],
      },
      level2: {
        template: ['The rope ladder hangs', 'the', '.'],
        correctAnswers: ['next to', 'tree'],
        options: ['next to', 'tree', 'in', 'flower', 'on'],
      },
      level3: {
        template: ['The rope ladder', '', 'the', '.'],
        correctAnswers: ['hangs', 'next to', 'tree'],
        options: ['hangs', 'next to', 'tree', 'sits', 'under', 'house'],
      },
      level4Chunks: ['The rope ladder', 'hangs', 'next to', 'the tree.'],
      level5WordBank: ['The', 'rope', 'ladder', 'hangs', 'next to', 'the', 'tree.', 'under', 'between'],
    },
  },
  {
    pageNumber: 7,
    title: 'Inside the Treehouse',
    image: GARDEN_IMAGE,
    imageAlt: 'Wooden treehouse interior with box and paper flags',
    sceneTheme: 'Treehouse Interior',
    sentences: [
      {
        fullText: 'Leo climbs up the wooden ladder.',
        parts: [{ text: 'Leo climbs up the wooden ladder.' }],
      },
      {
        fullText: 'Barnaby jumps through the open door.',
        parts: [{ text: 'Barnaby jumps through the open door.' }],
      },
      {
        fullText: 'A line of paper flags hangs in the warm room.',
        parts: [
          { text: 'A line of paper flags hangs ' },
          { text: 'in', isPreposition: true },
          { text: ' the warm room.' },
        ],
      },
      {
        fullText: 'A small flashlight is in the wooden cupboard.',
        parts: [
          { text: 'A small flashlight is ' },
          { text: 'in', isPreposition: true },
          { text: ' the wooden cupboard.', isObject: true },
        ],
      },
      {
        fullText: 'A small bird house sits behind the window.',
        parts: [
          { text: 'A small bird house sits ' },
          { text: 'behind', isPreposition: true },
          { text: ' the window.' },
        ],
      },
      {
        fullText: 'Leo sees another paper note on the table.',
        parts: [
          { text: 'Leo sees another paper note ' },
          { text: 'on', isPreposition: true },
          { text: ' the table.' },
        ],
      },
    ],
    question: {
      character: BARNABY_CHARACTER,
      questionText: 'Where is the small flashlight?',
      fullAnswer: 'The small flashlight is in the wooden cupboard.',
      targetPreposition: 'in',
      targetObject: 'cupboard',
      hint: 'Look inside the small wooden cupboard.',
      level1: {
        template: ['The small flashlight is', 'the wooden cupboard.'],
        correctAnswers: ['in'],
        options: ['in', 'under', 'behind', 'next to'],
      },
      level2: {
        template: ['The small flashlight is', 'the wooden', '.'],
        correctAnswers: ['in', 'cupboard'],
        options: ['in', 'cupboard', 'on', 'window', 'under'],
      },
      level3: {
        template: ['The small flashlight', '', 'the wooden', '.'],
        correctAnswers: ['is', 'in', 'cupboard'],
        options: ['is', 'in', 'cupboard', 'are', 'on', 'bench'],
      },
      level4Chunks: ['The small flashlight', 'is', 'in', 'the wooden cupboard.'],
      level5WordBank: ['The', 'small', 'flashlight', 'is', 'in', 'the', 'wooden', 'cupboard.', 'under', 'between'],
    },
  },
  {
    pageNumber: 8,
    title: 'Back to the Study Room',
    image: LIBRARY_IMAGE,
    imageAlt: 'Warm study room with glowing lamp, window, and chair',
    sceneTheme: 'Study Window',
    sentences: [
      {
        fullText: 'The sun goes down in the sky.',
        parts: [{ text: 'The sun goes down in the sky.' }],
      },
      {
        fullText: 'Leo and Barnaby run back into the warm house.',
        parts: [
          { text: 'Leo and Barnaby run back ' },
          { text: 'into', isPreposition: true },
          { text: ' the warm house.' },
        ],
      },
      {
        fullText: 'They walk into the quiet study room.',
        parts: [{ text: 'They walk into the quiet study room.' }],
      },
      {
        fullText: 'A soft chair sits in front of the window.',
        parts: [
          { text: 'A soft chair sits ' },
          { text: 'in front of', isPreposition: true },
          { text: ' the window.', isObject: true },
        ],
      },
      {
        fullText: 'A warm lamp shines on the wooden desk.',
        parts: [
          { text: 'A warm lamp shines ' },
          { text: 'on', isPreposition: true },
          { text: ' the wooden desk.' },
        ],
      },
      {
        fullText: 'A cat cushion lies on the carpet.',
        parts: [
          { text: 'A cat cushion lies ' },
          { text: 'on', isPreposition: true },
          { text: ' the carpet.' },
        ],
      },
    ],
    question: {
      character: LEO_CHARACTER,
      questionText: 'Where does the soft chair sit?',
      fullAnswer: 'The soft chair sits in front of the window.',
      targetPreposition: 'in front of',
      targetObject: 'window',
      hint: 'Look right before the glass window.',
      level1: {
        template: ['The soft chair sits', 'the window.'],
        correctAnswers: ['in front of'],
        options: ['in front of', 'under', 'in', 'behind'],
      },
      level2: {
        template: ['The soft chair sits', 'the', '.'],
        correctAnswers: ['in front of', 'window'],
        options: ['in front of', 'window', 'under', 'desk', 'on'],
      },
      level3: {
        template: ['The soft chair', '', 'the', '.'],
        correctAnswers: ['sits', 'in front of', 'window'],
        options: ['sits', 'in front of', 'window', 'stands', 'under', 'door'],
      },
      level4Chunks: ['The soft chair', 'sits', 'in front of', 'the window.'],
      level5WordBank: ['The', 'soft', 'chair', 'sits', 'in front of', 'the', 'window.', 'under', 'behind'],
    },
  },
  {
    pageNumber: 9,
    title: 'The Wooden Chest',
    image: LIBRARY_IMAGE,
    imageAlt: 'Study desk with books, ink bottle, map, and locked box',
    sceneTheme: 'Desk Clues',
    sentences: [
      {
        fullText: 'Leo holds his shiny key.',
        parts: [{ text: 'Leo holds his shiny key.' }],
      },
      {
        fullText: 'Three books sit on the corner of the desk.',
        parts: [
          { text: 'Three books sit ' },
          { text: 'on', isPreposition: true },
          { text: ' the corner of the desk.' },
        ],
      },
      {
        fullText: 'An ink bottle sits between the pen and the map.',
        parts: [
          { text: 'An ink bottle sits ' },
          { text: 'between', isPreposition: true },
          { text: ' the pen and the map.', isObject: true },
        ],
      },
      {
        fullText: 'A wooden chest stands on the desk.',
        parts: [
          { text: 'A wooden chest stands ' },
          { text: 'on', isPreposition: true },
          { text: ' the desk.' },
        ],
      },
      {
        fullText: 'Leo puts the key into the lock.',
        parts: [
          { text: 'Leo puts the key ' },
          { text: 'into', isPreposition: true },
          { text: ' the lock.' },
        ],
      },
      {
        fullText: 'The lock opens with a click sound.',
        parts: [{ text: 'The lock opens with a click sound.' }],
      },
    ],
    question: {
      character: BARNABY_CHARACTER,
      questionText: 'Where does the ink bottle sit?',
      fullAnswer: 'The ink bottle sits between the pen and the map.',
      targetPreposition: 'between',
      targetObject: 'map',
      hint: 'It sits in the middle of the pen and the map.',
      level1: {
        template: ['The ink bottle sits', 'the pen and the map.'],
        correctAnswers: ['between'],
        options: ['between', 'in', 'under', 'on'],
      },
      level2: {
        template: ['The ink bottle sits', 'the pen and the', '.'],
        correctAnswers: ['between', 'map'],
        options: ['between', 'map', 'under', 'book', 'in'],
      },
      level3: {
        template: ['The ink bottle', '', 'the pen and the', '.'],
        correctAnswers: ['sits', 'between', 'map'],
        options: ['sits', 'between', 'map', 'is', 'under', 'box'],
      },
      level4Chunks: ['The ink bottle', 'sits', 'between', 'the pen and the map.'],
      level5WordBank: ['The', 'ink', 'bottle', 'sits', 'between', 'the', 'pen', 'and', 'the', 'map.', 'under'],
    },
  },
  {
    pageNumber: 10,
    title: 'The Golden Compass!',
    image: LIBRARY_IMAGE,
    imageAlt: 'Open treasure chest with shining golden compass glowing warmly',
    sceneTheme: 'Golden Treasure',
    sentences: [
      {
        fullText: 'The wooden chest opens with a warm light!',
        parts: [{ text: 'The wooden chest opens with a warm light!' }],
      },
      {
        fullText: 'Inside the chest, a shiny gold compass shines.',
        parts: [{ text: 'Inside the chest, a shiny gold compass shines.' }],
      },
      {
        fullText: 'A gold card is hidden under the compass.',
        parts: [
          { text: 'A gold card is hidden ' },
          { text: 'under', isPreposition: true },
          { text: ' the compass.', isObject: true },
        ],
      },
      {
        fullText: 'Barnaby the cat sits next to the chest.',
        parts: [
          { text: 'Barnaby the cat sits ' },
          { text: 'next to', isPreposition: true },
          { text: ' the chest.' },
        ],
      },
      {
        fullText: 'Leo smiles with a big happy face.',
        parts: [{ text: 'Leo smiles with a big happy face.' }],
      },
      {
        fullText: "'We found the gold compass!' Leo says happily.",
        parts: [{ text: "'We found the gold compass!' Leo says happily." }],
      },
    ],
    question: {
      character: BARNABY_CHARACTER,
      questionText: 'Where is the gold card hidden?',
      fullAnswer: 'The gold card is under the compass.',
      targetPreposition: 'under',
      targetObject: 'compass',
      hint: 'Look below the shiny compass.',
      level1: {
        template: ['The gold card is', 'the compass.'],
        correctAnswers: ['under'],
        options: ['under', 'in front of', 'behind', 'in'],
      },
      level2: {
        template: ['The gold card is', 'the', '.'],
        correctAnswers: ['under', 'compass'],
        options: ['under', 'compass', 'on', 'clock', 'in'],
      },
      level3: {
        template: ['The gold card', '', 'the', '.'],
        correctAnswers: ['is', 'under', 'compass'],
        options: ['is', 'under', 'compass', 'was', 'on', 'shelf'],
      },
      level4Chunks: ['The gold card', 'is', 'under', 'the compass.'],
      level5WordBank: ['The', 'gold', 'card', 'is', 'under', 'the', 'compass.', 'between', 'behind'],
    },
  },
];

export const RETELL_CARDS: RetellCard[] = [
  {
    id: 'c1',
    stageName: 'Beginning',
    summary: 'The Attic Note',
    detail: 'Leo and Barnaby find a paper note hidden behind the clock in the attic.',
    correctIndex: 0,
  },
  {
    id: 'c2',
    stageName: 'Problem',
    summary: 'Finding the Key',
    detail: 'They find the shiny key in a tea cup and look for the lost gold compass.',
    correctIndex: 1,
  },
  {
    id: 'c3',
    stageName: 'Event',
    summary: 'Garden & Tree Clues',
    detail: 'They look under the garden bench and climb up the ladder next to the tree.',
    correctIndex: 2,
  },
  {
    id: 'c4',
    stageName: 'Ending',
    summary: 'The Gold Compass Found',
    detail: 'In the study room, they open the wooden chest and find the shiny gold compass!',
    correctIndex: 3,
  },
];

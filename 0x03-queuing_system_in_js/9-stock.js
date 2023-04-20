const express = require( 'express' );
const redis = require( 'redis' );
const { promisify } = require( 'util' );

const client = redis.createClient();

const app = express();
const port = 1245;

// Array containing the list of products
const listProducts = [ { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 }, { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 }, { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 }, { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 } ];

// Function to get item from listProducts by id
function getItemById ( id ) {
    return listProducts.find( product => product.itemId === id );
}

// Function to reserve stock by id
async function reserveStockById ( itemId, stock ) {
    const setAsync = promisify( client.set ).bind( client );
    await setAsync( `item.${ itemId }`, stock );
}

// Function to get current reserved stock by id
async function getCurrentReservedStockById ( itemId ) {
    const getAsync = promisify( client.get ).bind( client );
    const reservedStock = await getAsync( `item.${ itemId }` );
    return parseInt( reservedStock ) || 0;
}

// Route to list all products
app.get( '/list_products', ( req, res ) => {
    res.json( listProducts );
} );

// Route to get product detail by id
app.get( '/list_products/:itemId', async ( req, res ) => {
    const itemId = parseInt( req.params.itemId );
    const item = getItemById( itemId );
    if ( item ) {
        const currentQuantity = item.initialAvailableQuantity - await getCurrentReservedStockById( itemId );
        res.json( { ...item, currentQuantity } );
    } else {
        res.json( { status: 'Product not found' } );
    }
} );

// Route to reserve product by id
app.get( '/reserve_product/:itemId', async ( req, res ) => {
    const itemId = parseInt( req.params.itemId );
    const item = getItemById( itemId );
    if ( item ) {
        const currentReservedStock = await getCurrentReservedStockById( itemId );
        if ( currentReservedStock >= item.initialAvailableQuantity ) {
            res.json( { status: 'Not enough stock available', itemId } );
        } else {
            await reserveStockById( itemId, currentReservedStock + 1 );
            res.json( { status: 'Reservation confirmed', itemId } );
        }
    } else {
        res.json( { status: 'Product not found' } );
    }
} );

// Start server
app.listen( port, () => {
    console.log( `Server listening on port ${ port }` );
} );

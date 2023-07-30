function Expanse(id, text, category, amount, date) {
    if (id !== undefined && id !== null) {
        this.id = id;
    }    
    this.text = text;
    this.category = category;
    this.amount = amount;
    this.date = date;
}

function Category(name, catLimit) {
    this.name = name;
    if (catLimit === undefined || catLimit == null || catLimit < 0) {
        this.catLimit = null;
    } else {
        this.catLimit = catLimit;
    }
 }
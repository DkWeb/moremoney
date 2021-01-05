function Expanse(id, text, category, amount, date) {
    if (id !== undefined && id !== null) {
        this.id = id;
    }    
    this.text = text;
    this.category = category;
    this.amount = amount;
    this.date = date;
}
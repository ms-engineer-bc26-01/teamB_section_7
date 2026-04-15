def serialize_doc(doc: dict) -> dict:
    """MongoDBドキュメントのObjectIdをstr変換する共通関数"""
    if doc and "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc

# vite と fastAPIのフルスタックファイルアップロード、ダウンロードアプリ

## 起動方法
docker compose build --no-cache　キャッシュ無しでビルド  
docker compose up コンテナの起動  

## リンク
[swagger](http://localhost:8000/docs)  
[フロントエンド](http://localhost:5173)  

## 学んだこと
テーブルを作るときはcreate_allをする前にTable情報が参照されていないとテーブルが作られない  
def create_db_and_tables():　　  
    from ..models.file import TableFile  　　
    SQLModel.metadata.create_all(engine)　　 
トランザクション前後で整合性を合わせるためにDB保存が失敗した後は、物理ファイルも削除するようにする  
datetime.now(Zoneinfo("Asia/Tokyo"))で日本時間の取得が確実にできる
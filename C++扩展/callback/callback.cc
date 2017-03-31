#ifndef BUILDING_NODE_EXTENSION
#define BUILDING_NODE_EXTENSION
#endif
#include <node.h>
using namespace v8;
Handle<Value> RunCallback(const Arguments& args) {
  const unsigned argc = 2;
  HandleScope scope;
  Local<Function> callbackFun = Local<Function>::Cast(args[1]);
  Local<Value> argv[argc] = {Local<Value>::New(args[0]),Local<Value>::New(String::New("C++回调测试成功!"))};
  if(args[0]->IsNumber()){
  	argv[1] = Local<Value>::New(String::New("C++回调传入数字!"));
  }
  callbackFun->Call(Context::GetCurrent()->Global(), argc, argv);
  return scope.Close(Undefined());
}
int Jiecheng(int a){//构造函数求阶乘
  if (a > 1)
   return a*Jiecheng(a-1);
  else
   return 1;
}
void Init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("exports"),FunctionTemplate::New(RunCallback)->GetFunction());
}
NODE_MODULE(callback, Init)
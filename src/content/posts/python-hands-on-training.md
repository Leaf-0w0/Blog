---
title: Python实训 | 办公自动化
published: 2025-01-02
description: Python办公自动化实训笔记
tags:
  - Python
category: Tutorial
draft: false
image: ./post-cover/python.webp
---
# 一、读取Excel批量制作Word准考证
## 功能说明
1. **Excel文件读取**  
支持读取包含考生信息的Excel文件。能够准确提取Excel文件中的考生信息列，如姓名、准考证号等。  
2. **Word准考证生成**  
创建一个Word准考证模板，包含必要的字段和格式设置。使用python-docx库将考生信息填充到模板中，生成完整的准考证文档。  
3. **批量处理**  
遍历Excel文件中的考生数据，为每个考生生成一个独立的准考证文档。支持将生成的准考证文档保存到指定目录。  
4. **错误处理**  
在读取Excel文件时，能够捕获并处理可能的异常，如文件不存在、格式错误等。在生成Word文档时，能够处理数据缺失或格式不匹配的情况，确保生成的准考证文档内容完整、格式规范。  
5. **用户交互**  
提供命令行界面，允许用户选择Excel文件、设置输出目录等。可选：提供图形用户界面（GUI），简化用户操作。
## 核心代码实现
```python
# 导入pandas库，并将其简称为pd，用于数据处理
import pandas as pd
# 导入os库，用于与操作系统进行交互，例如文件和目录操作
import os
# 从docx库中导入Document类，用于操作Word文档
from docx import Document
# 导入Tk类和文件选择对话框相关的函数，用于与用户进行文件和目录选择的交互
from tkinter import Tk
from tkinter.filedialog import askopenfilename, askdirectory
# 尝试读取指定路径的Excel文件，如果文件不存在会打印提示信息并返回None，如果读取过程中发生其他异常也会打印错误信息并返回None
def read_excel_data(file_path):
    try:
        data = pd.read_excel(file_path)
        return data
    except FileNotFoundError:
        print("文件不存在，请检查文件路径！")
        return None
    except Exception as e:
        print(f"读取 Excel 文件时发生错误: {e}")
        return None
# 接受一行数据data_row和一个Word文档模板template_doc
def generate_credentials(data_row, template_doc):
    # 定义一个包含学号、姓名、性别和考点的字典data_dict
    data_dict = {'sno': data_row['学号'], 'name': data_row['姓名'], 'gender': data_row['性别'], 'local': data_row['考点']}
    # 遍历模板文档中的表格、行和单元格，将特定的占位符（如 {{sno}} 等）替换为相应的数据值
    for table in template_doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for key, value in data_dict.items():
                    cell.text = cell.text.replace(f"{{{{{key}}}}}", str(value))
    # 最后返回修改后的模板文档
    return template_doc
def batch_process(excel_file_path, output_directory, template_doc_path):
    # 首先调用read_excel_data读取Excel文件的数据
    data = read_excel_data(excel_file_path)
    # 如果数据读取成功，打开指定路径的Word模板文件
    if data is not None:
        for index, row in data.iterrows():
            # 每次都创建一个新的文档副本
            new_doc = Document(template_doc_path)
            # 对新副本进行修改
            new_doc = generate_credentials(row, new_doc)
            # 为生成的文档创建文件名
            file_name = f"{row['姓名']}_准考证.docx"
            # 为生成的文档指定保存路径
            file_path = os.path.join(output_directory, file_name)
            # 保存修改后的新副本
            new_doc.save(file_path)
def main():
    # 创建Tk根窗口，并隐藏
    root = Tk()
    root.withdraw()
    # 使用文件选择对话框让用户选择Excel文件、输出目录和Word模板文件
    excel_file_path = askopenfilename(title="选择 Excel 文件", filetypes=[("Excel 文件", "*.xlsx")])
    output_directory = askdirectory(title="选择输出目录")
    template_doc_path = askopenfilename(title="选择 Word 模板文件", filetypes=[("Word 文件", "*.docx")])
    # 调用batch_process函数进行批处理
    batch_process(excel_file_path, output_directory, template_doc_path)
# 确保代码在作为主程序运行时执行main函数
if __name__ == "__main__":
    main()
```
# 二、批量制作PPT证书
## 功能说明
1. **模板读取与解析**  
能够读取PPT模板文件，并解析其中的占位符（placeholder）和布局。支持多种PPT模板格式（如.pptx）。  
2. **数据源读取**  
支持读取Excel文件（如.xlsx）或CSV文件作为数据源。能够准确提取数据源中的获奖人员信息列，并与模板中的字段进行匹配。  
3. **信息填充与生成**  
使用python-pptx库将获奖人员信息填充到PPT模板中，生成完整的PPT证书。支持批量处理，为每个获奖人员生成一个独立的PPT证书。可以根据需求自定义证书的样式和布局，如字体、颜色、图片等。  
4. **文档保存与管理**  
将生成的PPT证书保存到指定目录，并支持自定义文件名格式。可以提供打印预览功能，方便用户检查生成的证书效果。
## 核心代码实现
```python
# 调用pptx中的Presentation类用于读取模板
from pptx import Presentation
# 调用pandas库以读取Excel文件
import pandas as pd
# 调用模板文件'奖状.pptx'
prs = Presentation("奖状.pptx")
# 获取占位符
#slide = prs.slides[0]
#for placeholder in slide.placeholders:
#    idx_ =placeholder.placeholder_format.idx
#    print(idx_)
#    placeholder.text=f"{idx_}"
# 保存包含占位符的pptx文件
#prs.save("奖状_占位符.pptx")
# 获取pptx模板id
#layouts = prs.slide_layouts
#print(len(layouts))
#for index,slide_layout in enumerate(layouts):
#    print(index,slide_layout.name)
# 使用pd.read_excel读取xlsx文件
df = pd.read_excel('名单.xlsx')
# 遍历批量生成PPT文件
for i in range(df.shape[0]):
    # 选择模板id
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    # 将姓名导入PPT模板中的占位符13处
    slide.placeholders[13].text =f'{df.iloc[i,:]["姓名"]}'
    # 将称号导入PPT模板中的占位符14处
    slide.placeholders[14].text =f'{df.iloc[i,:]["称号"]}'
    # 将颁发日期导入PPT模板中的占位符15处
    slide.placeholders[15].text =f'{df.iloc[i,:]["颁发日期"]}'
# 保存文件,命名为'奖状_all'
prs.save('奖状_all.pptx')
```
> **提示**：
> - 模板中的占位符索引（如 `13`、`14`、`15`）因模板结构而异，请先运行代码中注释掉的调试片段，以准确获取各占位符的实际索引。
